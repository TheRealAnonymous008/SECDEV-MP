import jwt = require('jsonwebtoken');
import config from "../config/authConfig";
import User from '../models/user';

const makeRefreshToken = async (user, token, callback) => {
    await jwt.sign(
        {
            id : user.id,
            role: user.role,
            accessIssuer: config.token.issuer,
        }
        , config.refreshToken.secret,
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
            callback(error, null, null);  
        }
    )
}

const signToken = (user : User,  callback: (error: Error | null, token: string | null, refreshToken: string | null) => void): void => {
    const timeSinceEpoch = new Date().getTime();
    const expirationTime = timeSinceEpoch + Number(config.token.expireTime) * 10000;
    try {
        jwt.sign(
            {
                id : user.Id,
                role: user.Role,
            },
            config.token.secret,
            {
                expiresIn: config.token.expireTime,
                issuer: config.token.issuer
            },
            async (error, token) => {
                if (error) {
                    callback(error, null, null);
                } else if (token) {
                    await makeRefreshToken(user, token, callback);
                }

            }
        );
    } catch (error) {
        callback(error, null, null);
    }
};

export default signToken;