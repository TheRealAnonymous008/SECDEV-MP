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
const signToken_1 = __importDefault(require("../utils/signToken"));
const enum_1 = require("../models/enum");
const user_1 = require("../repository/user");
const inputValidation = __importStar(require("../middleware/inputValidation"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const SALT_ROUNDS = 14;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                res.status(500).end();
                return;
            }
            res.status(200).end();
        })
            .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                        yield (0, signToken_1.default)(user, (err, token, refreshToken) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({
                                    auth: false,
                                    message: err.message,
                                    error: err,
                                }).end();
                            }
                            else if (token) {
                                if (refreshToken) {
                                    res = res.cookie('jwt', refreshToken, {
                                        httpOnly: true,
                                        secure: true,
                                        sameSite: "lax",
                                    });
                                    res.cookie('jwtacc', token, {
                                        httpOnly: true,
                                        secure: true,
                                        sameSite: "lax",
                                    });
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
                            message: "Password Input Failure",
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
            })
                .status(500)
                .end();
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});
const handshake = (req, res) => {
    try {
        const token = req.cookies.jwtacc;
        const sessionId = (0, jwt_decode_1.default)(token)["id"];
        user_1.UserRepository.getUserFromSession(sessionId)
            .then((value) => {
            if (value)
                res.json(value).end();
            else {
                res.json(undefined).end();
            }
        })
            .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
};
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    const sessionId = (0, jwt_decode_1.default)(token)["id"];
    yield user_1.UserRepository.deleteSession(sessionId);
    res.clearCookie("jwt").clearCookie("jwtacc").end();
});
exports.default = { register, login, logout, handshake };
