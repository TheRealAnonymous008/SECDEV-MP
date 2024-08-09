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
const Bcrypt = require("bcryptjs");
const enum_1 = require("../models/enum");
const user_1 = require("../repository/user");
const inputValidation_1 = require("../middleware/inputValidation");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const logger_1 = __importDefault(require("../utils/logger"));
const logConfig_1 = require("../config/logConfig");
const tokenUtils_1 = require("../utils/tokenUtils");
const authConfig_1 = require("../config/authConfig");
const SALT_ROUNDS = 14;
const register = (req, res, next) => {
    try {
        const salt = Bcrypt.genSaltSync(SALT_ROUNDS);
        const password = (0, inputValidation_1.validateRequired)(req.body.password, inputValidation_1.validatePassword);
        const user = {
            FirstName: (0, inputValidation_1.validateRequired)(req.body.firstName, inputValidation_1.validateName),
            LastName: (0, inputValidation_1.validateRequired)(req.body.lastName, inputValidation_1.validateName),
            Username: (0, inputValidation_1.validateRequired)(req.body.username, inputValidation_1.validateUsername),
            MobileNumber: (0, inputValidation_1.validateRequired)(req.body.mobileNumber, inputValidation_1.validateMobileNumber),
            Email: (0, inputValidation_1.validateRequired)(req.body.email, inputValidation_1.validateEmail),
            Salt: salt,
            Password: Bcrypt.hashSync(password, salt),
            Role: enum_1.RoleIds.VIEW
        };
        user_1.UserRepository.register(user)
            .then((result) => {
            if (result === undefined) {
                throw new Error(`Failed to register user ${user.Username}`);
            }
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `User registered: ${user.Username}`);
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error registering user: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in register function: ${err.message}`);
        next(err);
    }
};
const login = (req, res, next) => {
    try {
        const username = (0, inputValidation_1.validateRequired)(req.body.username, inputValidation_1.validateUsername);
        user_1.UserRepository.retrieveByUsername(username)
            .then((user) => {
            if (user) {
                Bcrypt.compare(req.body.password, user.Password, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (!result) {
                        logger_1.default.log(logConfig_1.LogLevel.DEBUG, `Failed login attempt for user: ${username}`);
                        res.json({
                            auth: false,
                            message: "Username and Password do not match!"
                        }).end();
                    }
                    else if (result) {
                        const data = yield (0, tokenUtils_1.initializeSession)(user);
                        yield (0, tokenUtils_1.signToken)(data, (err, token, refreshToken) => {
                            if (err) {
                                logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error signing token for user: ${username}, ${err.message}`);
                                res.json({
                                    auth: false,
                                    message: err.message,
                                    error: err,
                                });
                                next(err);
                            }
                            else if (token) {
                                if (refreshToken) {
                                    res.cookie('jwt', refreshToken, authConfig_1.COOKIE_SETTINGS);
                                    res.cookie('jwtacc', token, authConfig_1.COOKIE_SETTINGS);
                                    res.cookie('csrf', data.csrf, authConfig_1.COOKIE_SETTINGS);
                                    logger_1.default.log(logConfig_1.LogLevel.AUDIT, `User logged in: ${username}`);
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
                        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error comparing passwords for user: ${username}, ${error.message}`);
                        res.json({
                            auth: false,
                            message: "Username and Password do not match",
                        }).end();
                    }
                }));
            }
            else {
                logger_1.default.log(logConfig_1.LogLevel.DEBUG, `Failed login attempt for non-existing user: ${username}`);
                res.json({
                    auth: false,
                    error: "Username and Password do not match",
                }).end();
            }
        })
            .catch((error) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving user: ${username}, ${error.message}`);
            res.json({
                auth: false,
                error: error
            });
            next(error);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in login function for user: ${req.body.username}, ${err.message}`);
        next(err);
    }
};
const handshake = (req, res, next) => {
    try {
        const sessionId = (0, inputValidation_1.validateRequired)(res.locals.jwt.id, inputValidation_1.baseValidation);
        user_1.UserRepository.getUserFromSession(sessionId)
            .then((value) => {
            if (value) {
                res.json(value).end();
            }
            else {
                res.json(undefined).end();
            }
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in handshake function for session: ${sessionId}, ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in handshake function for session: ${res.locals.jwt.id}, ${err.message}`);
        next(err);
    }
};
const logout = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const sessionId = (0, inputValidation_1.validateRequired)((0, jwt_decode_1.default)(token)["id"], inputValidation_1.baseValidation);
        user_1.UserRepository
            .deleteSession(sessionId)
            .then((v) => {
            res.clearCookie("jwt")
                .clearCookie("jwtacc")
                .clearCookie("csrf")
                .status(200).end();
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `User logged out: ${sessionId}`);
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in logout function for session: ${sessionId}, ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in logout function: ${err.message}`);
        next(err);
    }
};
exports.default = { register, login, logout, handshake };
