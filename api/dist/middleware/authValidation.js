"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRefreshToken = exports.checkAccessToken = void 0;
const jwt = require("jsonwebtoken");
const authConfig_1 = require("../config/authConfig");
const tokenUtils_1 = require("../utils/tokenUtils");
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
    res.locals.jwt = (0, exports.checkAccessToken)(token);
};
const validateToken = (req, res, next) => {
    const refToken = req.cookies.jwt;
    let token = req.cookies.jwtacc;
    if (token && refToken) {
        try {
            const decoded = (0, exports.checkAccessToken)(token);
            if (decoded == null) {
                throw Error("JWT not decoded properly");
            }
            res.locals.jwt = decoded;
            next();
        }
        catch (error) {
            console.log("Error", error);
            try {
                (0, exports.checkRefreshToken)(refToken);
            }
            catch (error) {
                handleRefreshTokenExpired(res, error);
                token = (0, tokenUtils_1.refreshToken)(refToken);
                if (token) {
                    handleAccessTokenExpired(res, token);
                    next();
                }
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
const checkAccessToken = (token) => {
    let decoded = null;
    for (let i = 0; i < authConfig_1.ACCESS_SECRETS.length; ++i) {
        try {
            decoded = jwt.verify(token, authConfig_1.ACCESS_SECRETS[i], { issuer: authConfig_1.JWT_ISSUER });
        }
        catch (err) {
            // Do nothing
        }
        if (decoded != null)
            break;
    }
    return decoded;
};
exports.checkAccessToken = checkAccessToken;
const checkRefreshToken = (token) => {
    let decoded = null;
    for (let i = 0; i < authConfig_1.REFRESH_SECRETS.length; ++i) {
        try {
            decoded = jwt.verify(token, authConfig_1.REFRESH_SECRETS[i], { issuer: authConfig_1.JWT_ISSUER });
        }
        catch (err) {
            // Do nothing
        }
        if (decoded != null)
            break;
    }
    return decoded;
};
exports.checkRefreshToken = checkRefreshToken;
