import jwt = require('jsonwebtoken');
import config, { ACCESS_SECRETS, getRandomAccessSecret, getRandomRefreshSecret } from "../config/authConfig";
import User from '../models/user';
import { randomUUID } from 'crypto';
import { UserRepository } from '../repository/user';

var uid = require('uid-safe')

const makeRefreshToken = async (user, token, sessionId, callback) => {
    await jwt.sign(
        {
            id : sessionId,
            role: user.Role,
            accessIssuer: config.token.issuer,
        },
        getRandomRefreshSecret(),
        {
            expiresIn: config.refreshToken.expireTime
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
    const expirationTime = timeSinceEpoch + Number(config.token.expireTime) * 10000;
    const sessionId = uid.sync(24)


    try {
        await UserRepository.addSession(user.Id, sessionId);
        const secret = getRandomAccessSecret()

        await jwt.sign(
            {
                id : sessionId,
                role: user.Role.toString(),
            },
            secret,
            {
                expiresIn: config.token.expireTime,
                issuer: config.token.issuer,
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