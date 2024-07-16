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
const user_1 = require("../projections/user");
const user_2 = require("../repository/user");
const inputValidation_1 = require("../middleware/inputValidation");
const Bcrypt = require("bcryptjs");
const cryptoUtils_1 = require("../utils/cryptoUtils");
const all = (req, res) => {
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
};
const id = (req, res) => {
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
};
const SALT_ROUNDS = 14;
const create = (req, res) => {
    try {
        const salt = Bcrypt.genSaltSync(SALT_ROUNDS);
        const password = (0, cryptoUtils_1.getRandom)();
        const user = {
            FirstName: (0, inputValidation_1.validateName)(req.body.firstName),
            LastName: (0, inputValidation_1.validateName)(req.body.lastName),
            Username: (0, inputValidation_1.validateUsername)(req.body.username),
            MobileNumber: (0, inputValidation_1.validateMobileNumber)(req.body.mobileNumber),
            Email: (0, inputValidation_1.validateEmail)(req.body.email),
            Salt: salt,
            Password: Bcrypt.hashSync(password, salt),
            Role: (0, inputValidation_1.validateRole)(req.body.role)
        };
        user_2.UserRepository.register(user)
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
};
// req is any so thatwe can get all the files
const upload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = yield (0, inputValidation_1.validateImage)(req.file);
        const id = res.locals.jwt.id;
        const csrf = res.locals.jwt.csrf;
        user_2.UserRepository.upload(id, csrf, file)
            .then((result) => res.status(200).end())
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
const update = (req, res) => {
    try {
        const user = {
            FirstName: (0, inputValidation_1.validateName)(req.body.firstName),
            LastName: (0, inputValidation_1.validateName)(req.body.lastName),
            Username: (0, inputValidation_1.validateUsername)(req.body.username),
            MobileNumber: (0, inputValidation_1.validateMobileNumber)(req.body.mobileNumber),
            Email: (0, inputValidation_1.validateEmail)(req.body.email),
            Role: (0, inputValidation_1.validateRole)(req.body.role)
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
};
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
const filter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = makeQuery(req);
        user_2.UserRepository.filter(query)
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
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
});
const makeQuery = (req) => {
    const name = (0, inputValidation_1.baseValidation)(req.query.name);
    const username = (0, inputValidation_1.baseValidation)(req.query.username);
    const email = (0, inputValidation_1.baseValidation)(req.query.email);
    const mobileNumber = (0, inputValidation_1.baseValidation)(req.query.mobileNumber);
    const role = (0, inputValidation_1.baseValidation)(req.query.role);
    const limit = (0, inputValidation_1.validateLimit)(req.query.limit);
    const skip = (0, inputValidation_1.baseValidation)(req.query.skip);
    return {
        name: (name) ? name : null,
        username: (username) ? username : null,
        email: (email) ? email : null,
        mobileNumber: (mobileNumber) ? mobileNumber : null,
        role: (role) ? role : null,
        limit: (limit) ? limit : null,
        skip: (skip) ? skip : null,
    };
};
exports.default = { all, id, create, upload, update, remove, filter };
