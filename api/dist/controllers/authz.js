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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bcrypt = require("bcryptjs");
const enum_1 = require("../models/enum");
const user_1 = require("../repository/user");
const inputValidation = __importStar(require("../middleware/inputValidation"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const tokenUtils_1 = require("../utils/tokenUtils");
const authConfig_1 = require("../config/authConfig");
const SALT_ROUNDS = 14;
const register = (req, res, next) => {
    try {
        const salt = Bcrypt.genSaltSync(SALT_ROUNDS);
        const password = inputValidation.validatePassword(req.body.password);
        const user = {
            FirstName: inputValidation.validateName(req.body.firstName),
            LastName: inputValidation.validateName(req.body.lastName),
            Username: inputValidation.validateUsername(req.body.username),
            MobileNumber: inputValidation.validateMobileNumber(req.body.mobileNumber),
            Email: inputValidation.validateEmail(req.body.email),
            Salt: salt,
            Password: Bcrypt.hashSync(password, salt),
            Role: enum_1.RoleIds.VIEW
        };
        user_1.UserRepository.register(user)
            .then((result) => {
            if (result == undefined) {
                throw new Error(`Failed to register user ${user.Username}`);
            }
            res.status(200).end();
        })
            .catch((err) => {
            next(err);
        });
    }
    catch (err) {
        next(err);
    }
};
const login = (req, res, next) => {
    try {
        let username = inputValidation.validateUsername(req.body.username);
        user_1.UserRepository.retrieveByUsername(username)
            .then((user) => {
            if (user) {
                Bcrypt.compare(req.body.password, user.Password, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (!result) {
                        res.json({
                            auth: false,
                            message: "Username and Password do not match!"
                        }).end();
                    }
                    else if (result) {
                        const data = yield (0, tokenUtils_1.initializeSession)(user);
                        yield (0, tokenUtils_1.signToken)(data, (err, token, refreshToken) => {
                            if (err) {
                                res.json({
                                    auth: false,
                                    message: err.message,
                                    error: err,
                                });
                                next(err);
                            }
                            else if (token) {
                                if (refreshToken) {
                                    res = res.cookie('jwt', refreshToken, authConfig_1.COOKIE_SETTINGS);
                                    res.cookie('jwtacc', token, authConfig_1.COOKIE_SETTINGS);
                                    res.cookie('csrf', data.csrf, authConfig_1.COOKIE_SETTINGS);
                                    res.json({
                                        auth: true,
                                        message: "Authenticated",
                                        token: token,
                                        success: true,
                                    }).status(200).end();
                                }
                            }
                        });
                    }
                    else if (error) {
                        res.json({
                            auth: false,
                            message: "Username and Password do not match",
                        }).end();
                    }
                }));
            }
            else {
                res.json({
                    auth: false,
                    error: "Username and Password do not match",
                }).end();
            }
        })
            .catch((error) => {
            res.json({
                auth: false,
                error: error
            });
            next(error);
        });
    }
    catch (err) {
        next(err);
    }
};
const handshake = (req, res, next) => {
    try {
        const sessionId = res.locals.jwt.id;
        user_1.UserRepository.getUserFromSession(sessionId)
            .then((value) => {
            if (value)
                res.json(value).end();
            else {
                res.json(undefined).end();
            }
        })
            .catch((err) => {
            next(err);
        });
    }
    catch (err) {
        next(err);
    }
};
const logout = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const sessionId = (0, jwt_decode_1.default)(token)["id"];
        user_1.UserRepository
            .deleteSession(sessionId)
            .then((v) => {
            res.clearCookie("jwt")
                .clearCookie("jwtacc")
                .clearCookie("csrf")
                .end();
        })
            .catch((err) => {
            next(err);
        });
    }
    catch (err) {
        next(err);
    }
};
exports.default = { register, login, logout, handshake };
