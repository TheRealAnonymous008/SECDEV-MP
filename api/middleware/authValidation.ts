import { NextFunction, Request, Response } from "express";
import jwt = require("jsonwebtoken");
import config, { ACCESS_SECRETS, REFRESH_SECRETS } from "../config/authConfig";
import refreshToken from "../utils/refreshToken";

const clearRefreshToken = (res : Response) => {
    res.clearCookie("jwt")
}

const clearAccessToken = (res : Response) => {
    res.clearCookie("jwtacc")
}

const handleRefreshTokenExpired = (res : Response, error: any) => {
    clearRefreshToken(res);
    res.json({
        message: "Refresh token expired, please log in again",
        error,
        auth: false,
    });
}

const handleAccessTokenExpired = (res: Response, token : any ) => {
    clearAccessToken(res);
    res.cookie('jwtacc', token, 
            {
                httpOnly: false,
                secure: true,
                sameSite: "none",
            })
    res.locals.jwt = checkAccessToken(token)
   
}


const validateToken = (req : Request, res : Response, next : NextFunction) => {
    const refToken = req.cookies.jwt;
    let token = req.cookies.jwtacc
    if(token && refToken) {
        try {
            const decoded = checkAccessToken(token)
            if (decoded == null){
                throw Error("JWT not decoded properly")
            }
            res.locals.jwt = decoded;
            next();
        }
        catch(error){
            console.log("Error", error)
            try{
                checkRefreshToken(refToken)
            }
            catch(error){
                handleRefreshTokenExpired(res, error)

                token = refreshToken(refToken)
                if (token){
                    handleAccessTokenExpired(res, token)
                    next()
                }
                else {
                    return res.json({
                        message: 'Reassigning token failure in authValidation middleware',
                        auth: false
                    }).end();
                }
            }
        }
    } else {
        clearAccessToken(res);
        clearRefreshToken(res);
        res.status(403)
    }
};

export default validateToken;

export const checkAccessToken = (token) => {
    let decoded = null 
    for (let i = 0; i < ACCESS_SECRETS.length; ++i){
        try {
            decoded = jwt.verify(token, ACCESS_SECRETS[i], {issuer : config.token.issuer})
        }
        catch(err){
            // Do nothing
        }

        if (decoded != null)
            break
    }
    return decoded
}


export const checkRefreshToken = (token) => {
    let decoded = null 
    for (let i = 0; i < REFRESH_SECRETS.length; ++i){
        try {
            decoded = jwt.verify(token, REFRESH_SECRETS[i], {issuer : config.token.issuer})
        }
        catch(err){
            // Do nothing
        }

        if (decoded != null)
            break
    }

    return decoded
}