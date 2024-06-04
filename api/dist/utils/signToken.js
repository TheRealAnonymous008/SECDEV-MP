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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const authConfig_1 = __importDefault(require("../config/authConfig"));
const makeRefreshToken = (user, token, callback) => __awaiter(void 0, void 0, void 0, function* () {
    yield jwt.sign({
        id: user.id,
        role: user.role,
        accessIssuer: authConfig_1.default.token.issuer,
    }, authConfig_1.default.refreshToken.secret, {
        expiresIn: authConfig_1.default.refreshToken.expireTime
    }, (error, refreshToken) => {
        if (error) {
            callback(error, null, null);
        }
        else if (refreshToken) {
            callback(null, token, refreshToken);
        }
        callback(error, null, null);
    });
});
const signToken = (user, callback) => {
    const timeSinceEpoch = new Date().getTime();
    const expirationTime = timeSinceEpoch + Number(authConfig_1.default.token.expireTime) * 10000;
    try {
        jwt.sign({
            id: user.Id,
            role: user.Role,
        }, authConfig_1.default.token.secret, {
            expiresIn: authConfig_1.default.token.expireTime,
            issuer: authConfig_1.default.token.issuer
        }, (error, token) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                callback(error, null, null);
            }
            else if (token) {
                yield makeRefreshToken(user, token, callback);
            }
        }));
    }
    catch (error) {
        callback(error, null, null);
    }
};
exports.default = signToken;
