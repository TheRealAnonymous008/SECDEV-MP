"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenUtils_1 = require("../utils/tokenUtils");
const inputValidation_1 = require("./inputValidation");
const clearRefreshToken = (res) => {
    res.clearCookie("jwt");
};
const clearAccessToken = (res) => {
    res.clearCookie("jwtacc");
};
const handleRefreshTokenExpired = (res, error) => {
    clearRefreshToken(res);
    res.json({
        message: "Refresh token expired, please log in again",
        error,
        auth: false,
    });
};
const handleAccessTokenExpired = (res, token) => {
    clearAccessToken(res);
    res.cookie('jwtacc', token, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
    });
    res.locals.jwt = (0, tokenUtils_1.checkAccessToken)(token);
};
const validateToken = (req, res, next) => {
    const refToken = (0, inputValidation_1.validateJWT)(req.cookies.jwt);
    let token = (0, inputValidation_1.validateJWT)(req.cookies.jwtacc);
    if (token && refToken) {
        try {
            const decoded = (0, tokenUtils_1.checkAccessToken)(token);
            if (decoded == null) {
                throw Error("JWT not decoded properly");
            }
            res.locals.jwt = decoded;
            next();
        }
        catch (error) {
            try {
                (0, tokenUtils_1.checkRefreshToken)(refToken);
            }
            catch (error) {
                handleRefreshTokenExpired(res, error);
                token = (0, tokenUtils_1.refreshToken)(refToken);
                if (token) {
                    handleAccessTokenExpired(res, token);
                    next();
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
    }
    else {
        clearAccessToken(res);
        clearRefreshToken(res);
        res.status(403);
    }
};
exports.default = validateToken;
