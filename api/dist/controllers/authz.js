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
const signToken_1 = __importDefault(require("../utils/signToken"));
const enum_1 = require("../models/enum");
const user_1 = require("../repository/user");
const SALT_ROUNDS = 10;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = Bcrypt.genSaltSync(SALT_ROUNDS);
    const user = {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Username: req.body.username,
        MobileNumber: req.body.mobileNumber,
        Email: req.body.email,
        Salt: salt,
        Password: Bcrypt.hashSync(req.body.password, salt),
        Role: enum_1.Roles.ADMIN
    };
    try {
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
    user_1.UserRepository.retrieveByUsername(req.body.username)
        .then((user) => {
        if (user) {
            Bcrypt.compare(req.body.password, user.Password, (error, result) => {
                if (!result) {
                    res.json({
                        auth: false,
                        message: "Username and Password do not match!"
                    }).end();
                }
                else if (result) {
                    (0, signToken_1.default)(user, (err, token, refreshToken) => {
                        if (err) {
                            res.status(500).json({
                                auth: false,
                                message: err.message,
                                error: err,
                            }).end();
                        }
                        else if (token) {
                            if (refreshToken) {
                                res.cookie('jwt', refreshToken, {
                                    httpOnly: true,
                                    secure: true,
                                    sameSite: "none",
                                });
                                res.cookie('jwtacc', token, {
                                    httpOnly: false,
                                    secure: true,
                                    sameSite: "none",
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
            });
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
});
const logout = (req, res) => {
    res.clearCookie("jwt").clearCookie("jwtacc").end();
};
exports.default = { register, login, logout };
