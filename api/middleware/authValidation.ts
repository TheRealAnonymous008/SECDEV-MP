import { NextFunction, Request, Response } from "express";
import { checkAccessToken, checkRefreshToken, refreshToken } from "../utils/tokenUtils";
import { validateJWT } from "./inputValidation";

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
    const refToken = validateJWT(req.cookies.jwt);
    let token = validateJWT(req.cookies.jwtacc);

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
                // TODO: Maybe fix this
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
