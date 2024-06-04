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
const Bcrypt = require("bcryptjs");
const user_1 = require("../projections/user");
const user_2 = require("../repository/user");
const enum_1 = require("../models/enum");
const inputValidation = __importStar(require("../middleware/inputValidation"));
const SALT_ROUNDS = 10;
const all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_2.UserRepository.retrieveAll()
        .then((result) => {
        if (result.length == 0) {
            res.status(500).end();
            return;
        }
        res.json({
            data: (0, user_1.makeUserArrayView)(result),
            count: result.length
        });
        res.status(200).end();
    })
        .catch((err) => {
        console.log(err);
        res.status(500).end();
    });
});
const id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = parseInt(req.query.id.toString());
        user_2.UserRepository.retrieveById(id)
            .then((result) => {
            if (result.length == 0) {
                res.status(500).end();
                return;
            }
            res.json((0, user_1.makeUserView)(result));
            res.status(200).end();
        })
            .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).end();
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        inputValidation.validateRegistrationInput(req.body.firstName, req.body.lastName, req.body.username, req.body.password, req.body.mobileNumber, req.body.email);
        const salt = Bcrypt.genSaltSync(SALT_ROUNDS);
        const user = {
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            Username: req.body.username,
            MobileNumber: req.body.mobileNumber,
            Email: req.body.email,
            Salt: salt,
            Password: Bcrypt.hashSync(req.body.password, salt),
            Role: enum_1.RoleIds.VIEW
        };
        try {
            const result = user_2.UserRepository.register(user);
            if (result === undefined) {
                throw new Error("Failed to register user");
            }
            res.status(200).end();
        }
        catch (err) {
            console.log(err);
            res.status(500).send({ message: "Error registering user" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Username: req.body.username,
        MobileNumber: req.body.mobileNumber,
        Email: req.body.email,
        Role: req.body.role
    };
    try {
        user_2.UserRepository.update(parseInt(req.query.id.toString()), user)
            .then((result) => {
            if (result == undefined) {
                res.status(500).end();
                return;
            }
            res.json((0, user_1.makeUserView)(Object.assign(Object.assign({}, user), { id: result })));
            res.status(200).end();
        })
            .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        user_2.UserRepository.delete(parseInt(req.query.id.toString()))
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
        res.status(500);
    }
});
exports.default = { all, id, register, update, remove };
