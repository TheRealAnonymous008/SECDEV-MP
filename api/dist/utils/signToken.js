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
const crypto_1 = require("crypto");
const user_1 = require("../repository/user");
const makeRefreshToken = (user, token, sessionId, callback) => __awaiter(void 0, void 0, void 0, function* () {
    yield jwt.sign({
        id: sessionId,
        role: user.Role,
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
        else {
            callback(error, null, null);
        }
    });
});
const signToken = (user, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const timeSinceEpoch = new Date().getTime();
    const expirationTime = timeSinceEpoch + Number(authConfig_1.default.token.expireTime) * 10000;
    const sessionId = (0, crypto_1.randomUUID)();
    try {
        yield user_1.UserRepository.addSession(user.Id, sessionId);
        yield jwt.sign({
            id: sessionId,
            role: user.Role.toString(),
        }, authConfig_1.default.token.secret, {
            expiresIn: authConfig_1.default.token.expireTime,
            issuer: authConfig_1.default.token.issuer,
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
exports.default = signToken;
