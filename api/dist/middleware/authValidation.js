"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRefreshToken = exports.checkAccessToken = void 0;
const jwt = require("jsonwebtoken");
const authConfig_1 = __importStar(require("../config/authConfig"));
const refreshToken_1 = __importDefault(require("../utils/refreshToken"));
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
                token = (0, refreshToken_1.default)(refToken);
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
            decoded = jwt.verify(token, authConfig_1.ACCESS_SECRETS[i], { issuer: authConfig_1.default.token.issuer });
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
            decoded = jwt.verify(token, authConfig_1.REFRESH_SECRETS[i], { issuer: authConfig_1.default.token.issuer });
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
