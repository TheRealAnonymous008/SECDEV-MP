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
const Bcrypt = require("bcryptjs");
const user_1 = require("../projections/user");
const user_2 = require("../repository/user");
const enum_1 = require("../models/enum");
const inputValidation_1 = require("../middleware/inputValidation");
const SALT_ROUNDS = 10;
const all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_2.UserRepository.retrieveAll()
        .then((result) => {
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
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        user_2.UserRepository.retrieveById(id)
            .then((result) => {
            if (result.length == 0) {
                res.status(404).end();
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
// req is any so thatwe can get all the files
const upload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        console.log(file);
        res.status(200).end();
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        next();
        const salt = Bcrypt.genSaltSync(SALT_ROUNDS);
        const user = {
            FirstName: (0, inputValidation_1.validateName)(req.body.firstName),
            LastName: (0, inputValidation_1.validateName)(req.body.lastName),
            Username: (0, inputValidation_1.validateUsername)(req.body.username),
            MobileNumber: (0, inputValidation_1.validateMobileNumber)(req.body.mobileNumber),
            Email: (0, inputValidation_1.validateEmail)(req.body.email),
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
    try {
        const user = {
            FirstName: (0, inputValidation_1.validateName)(req.body.firstName),
            LastName: (0, inputValidation_1.validateName)(req.body.lastName),
            Username: (0, inputValidation_1.validateUsername)(req.body.username),
            MobileNumber: (0, inputValidation_1.validateMobileNumber)(req.body.mobileNumber),
            Email: (0, inputValidation_1.validateEmail)(req.body.email),
            Role: req.body.role
        };
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        user_2.UserRepository.update(id, user)
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
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        user_2.UserRepository.delete(id)
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
exports.default = { all, id, register, upload, update, remove };
