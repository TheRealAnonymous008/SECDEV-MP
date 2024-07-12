import jwt = require('jsonwebtoken');
import { ACCESS_SECRETS, JWT_EXPIRE_TIME, JWT_ISSUER, REFRESH_EXPIRE_TIME, REFRESH_SECRETS, getRandomAccessSecret, getRandomRefreshSecret } from "../config/authConfig";
import { RoleIds } from '../models/enum';
import User from '../models/user';
import { UserRepository } from '../repository/user';
import { getRandom, getTimestamp } from './cryptoUtils';

export const refreshToken = (refreshjwt : string) : string => {

    const decoded = checkRefreshToken(refreshjwt);

    if(decoded) {
        return jwt.sign(
            {
                id : decoded.id,
                role: decoded.role,
            },
            getRandomRefreshSecret(),
            {
                expiresIn: JWT_EXPIRE_TIME,
                issuer: decoded.accessIssuer,
            },);
    }

    return "";
}

interface TokenData {
    id : string,
    admin: boolean,
    csrf : string
}


const makeRefreshToken = async (token, data : TokenData, callback) => {
    await jwt.sign(
        {
            id : data.id,
            admin: data.admin,
            accessIssuer: JWT_ISSUER,
        },
        getRandomRefreshSecret(),
        {
            expiresIn: REFRESH_EXPIRE_TIME
        },
        (error, refreshToken) => {
            if(error) {
                callback(error, null, null);
            } 
            else if(refreshToken) {
                callback(null, token, refreshToken);
            }
            else{
                callback(error, null, null);  
            }
        }
    )
}

export const initializeSession = async(user : User) => {
    const sessionId = getRandom()
    const csrf = getRandom();
    await UserRepository.addSession(user.Id, sessionId, csrf);

    return {
        id : sessionId,
        admin: user.Role == RoleIds.ADMIN,
        csrf: csrf
    }
}

export const signToken = async (data : TokenData,  callback: (error: Error | null, token: string | null, refreshToken: string | null) => void): Promise<void> => {
    const timeSinceEpoch = getTimestamp();
    const expirationTime = timeSinceEpoch + Number(JWT_EXPIRE_TIME) * 10000;
    try {
        const secret = getRandomAccessSecret()
        await jwt.sign(
            {
                id : data.id,
                admin: data.admin,
            },
            secret,
            {
                expiresIn: JWT_EXPIRE_TIME,
                issuer: JWT_ISSUER,
            },
            async (error, token) => {
                if (error) {
                    callback(error, null, null);
                } else if (token) {
                    await makeRefreshToken(token, data, callback);
                }

            }
        );

    } catch (error) {
        callback(error, null, null);
    }
};

export const checkAccessToken = (token) => {
    let decoded = null 
    for (let i = 0; i < ACCESS_SECRETS.length; ++i){
        try {
            decoded = jwt.verify(token, ACCESS_SECRETS[i], {issuer : JWT_ISSUER})
        }
        catch(err){

        }

        if (decoded != null)
            break
    }
    if (decoded == null){
        console.log("Error: Access Token Invalid")
    }
    return decoded
}


export const checkRefreshToken = (token) => {
    let decoded = null 
    for (let i = 0; i < REFRESH_SECRETS.length; ++i){
        try {
            decoded = jwt.verify(token, REFRESH_SECRETS[i], {issuer : JWT_ISSUER})
        }
        catch(err){
            // Do nothing
        }

        if (decoded != null)
            break
    }
    if (decoded == null){
        console.log("Error: Refresh Token Invalid")
    }
    return decoded
}