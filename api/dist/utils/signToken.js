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
const jwt = require("jsonwebtoken");
const authConfig_1 = __importStar(require("../config/authConfig"));
const user_1 = require("../repository/user");
var uid = require('uid-safe');
const makeRefreshToken = (user, token, sessionId, callback) => __awaiter(void 0, void 0, void 0, function* () {
    yield jwt.sign({
        id: sessionId,
        role: user.Role,
        accessIssuer: authConfig_1.default.token.issuer,
    }, (0, authConfig_1.getRandomRefreshSecret)(), {
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
    const sessionId = uid.sync(24);
    try {
        yield user_1.UserRepository.addSession(user.Id, sessionId);
        const secret = (0, authConfig_1.getRandomAccessSecret)();
        yield jwt.sign({
            id: sessionId,
            role: user.Role.toString(),
        }, secret, {
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
