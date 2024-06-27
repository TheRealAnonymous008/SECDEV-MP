import jwt = require('jsonwebtoken');
import { ACCESS_SECRETS, JWT_EXPIRE_TIME, JWT_ISSUER, REFRESH_EXPIRE_TIME, getRandomAccessSecret, getRandomRefreshSecret } from "../config/authConfig";
import User from '../models/user';
import { randomUUID } from 'crypto';
import { UserRepository } from '../repository/user';
import { RoleIds } from '../models/enum';

var uid = require('uid-safe')

const makeRefreshToken = async (user, token, sessionId, callback) => {
    await jwt.sign(
        {
            id : sessionId,
            role: user.Role,
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

const signToken = async (user : User,  callback: (error: Error | null, token: string | null, refreshToken: string | null) => void): Promise<void> => {
    const timeSinceEpoch = new Date().getTime();
    const expirationTime = timeSinceEpoch + Number(JWT_EXPIRE_TIME) * 10000;
    const sessionId = uid.sync(24)


    try {
        await UserRepository.addSession(user.Id, sessionId);
        const secret = getRandomAccessSecret()

        await jwt.sign(
            {
                id : sessionId,
                admin: user.Role == RoleIds.ADMIN
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
                    await makeRefreshToken(user, token, sessionId,  callback);
                }

            }
        );
    } catch (error) {
        callback(error, null, null);
    }
};

export default signToken;