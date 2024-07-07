"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = exports.refreshToken = void 0;
const jwt = require("jsonwebtoken");
const authConfig_1 = require("../config/authConfig");
const authValidation_1 = require("../middleware/authValidation");
const enum_1 = require("../models/enum");
const user_1 = require("../repository/user");
const refreshToken = (refreshjwt) => {
    const decoded = (0, authValidation_1.checkRefreshToken)(refreshjwt);
    if (decoded) {
        return jwt.sign({
            id: decoded.id,
            role: decoded.role,
        }, (0, authConfig_1.getRandomRefreshSecret)(), {
            expiresIn: authConfig_1.JWT_EXPIRE_TIME,
            issuer: decoded.accessIssuer,
        });
    }
    return "";
};
exports.refreshToken = refreshToken;
var uid = require('uid-safe');
const makeRefreshToken = (user, token, sessionId, callback) => __awaiter(void 0, void 0, void 0, function* () {
    yield jwt.sign({
        id: sessionId,
        role: user.Role,
        accessIssuer: authConfig_1.JWT_ISSUER,
    }, (0, authConfig_1.getRandomRefreshSecret)(), {
        expiresIn: authConfig_1.REFRESH_EXPIRE_TIME
    }, (error, refreshToken) => {
        if (error) {
            callback(error, null, null);
        }
        else if (refreshToken) {
            callback(null, token, refreshToken);
        }
        else {
            callback(error, null, null);
        }
    });
});
const signToken = (user, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const timeSinceEpoch = new Date().getTime();
    const expirationTime = timeSinceEpoch + Number(authConfig_1.JWT_EXPIRE_TIME) * 10000;
    const sessionId = uid.sync(24);
    try {
        yield user_1.UserRepository.addSession(user.Id, sessionId);
        const secret = (0, authConfig_1.getRandomAccessSecret)();
        yield jwt.sign({
            id: sessionId,
            admin: user.Role == enum_1.RoleIds.ADMIN
        }, secret, {
            expiresIn: authConfig_1.JWT_EXPIRE_TIME,
            issuer: authConfig_1.JWT_ISSUER,
        }, (error, token) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                callback(error, null, null);
            }
            else if (token) {
                yield makeRefreshToken(user, token, sessionId, callback);
            }
        }));
    }
    catch (error) {
        callback(error, null, null);
    }
});
exports.signToken = signToken;
