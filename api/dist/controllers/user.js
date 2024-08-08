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
const all = (req, res, next) => {
    user_2.UserRepository.retrieveAll()
        .then((result) => {
        res.json({
            data: (0, user_1.makeUserArrayView)(result),
            count: result.length
        });
        res.status(200).end();
    })
        .catch((err) => {
        next(err);
    });
};
const id = (req, res, next) => {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
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
            next(err);
        });
    }
    catch (error) {
        next(error);
    }
};
const SALT_ROUNDS = 14;
const create = (req, res, next) => {
    try {
        const salt = Bcrypt.genSaltSync(SALT_ROUNDS);
        const password = (0, cryptoUtils_1.getRandom)();
        const user = {
            FirstName: (0, inputValidation_1.validateRequired)(req.body.firstName, inputValidation_1.validateName),
            LastName: (0, inputValidation_1.validateRequired)(req.body.lastName, inputValidation_1.validateName),
            Username: (0, inputValidation_1.validateRequired)(req.body.username, inputValidation_1.validateUsername),
            MobileNumber: (0, inputValidation_1.validateRequired)(req.body.mobileNumber, inputValidation_1.validateMobileNumber),
            Email: (0, inputValidation_1.validateRequired)(req.body.email, inputValidation_1.validateEmail),
            Salt: salt,
            Password: Bcrypt.hashSync(password, salt),
            Role: (0, inputValidation_1.validateRequired)(req.body.role, inputValidation_1.validateRole)
        };
        user_2.UserRepository.register(user)
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
// req is any so thatwe can get all the files
const upload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = yield (0, inputValidation_1.validateImage)(req.file).catch((err) => { next(err); });
        const id = res.locals.jwt.id;
        const csrf = res.locals.jwt.csrf;
        user_2.UserRepository.upload(id, csrf, file)
            .then((result) => res.status(200).end())
            .catch((err) => {
            next(err);
        });
    }
    catch (err) {
        next(err);
    }
});
const update = (req, res, next) => {
    try {
        let user = {
            FirstName: (0, inputValidation_1.validateRequired)(req.body.firstName, inputValidation_1.validateName),
            LastName: (0, inputValidation_1.validateRequired)(req.body.lastName, inputValidation_1.validateName),
            Username: (0, inputValidation_1.validateRequired)(req.body.username, inputValidation_1.validateUsername),
            MobileNumber: (0, inputValidation_1.validateRequired)(req.body.mobileNumber, inputValidation_1.validateMobileNumber),
            Email: (0, inputValidation_1.validateRequired)(req.body.email, inputValidation_1.validateEmail),
            Role: (0, inputValidation_1.validateRequired)(req.body.role, inputValidation_1.validateRole)
        };
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        user_2.UserRepository.update(id, user)
            .then((result) => {
            if (result == undefined) {
                throw new Error(`Failed to update user with id ${id}`);
            }
            res.json((0, user_1.makeUserView)(Object.assign(Object.assign({}, user), { id: result })));
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
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger)
            .then((result) => {
            if (result == undefined) {
                throw new Error(`Failed to delete user with id ${id}`);
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
});
const filter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            next(err);
        });
    }
    catch (err) {
        next(err);
    }
});
const makeQuery = (req) => {
    const name = (0, inputValidation_1.validateOptional)(req.query.name, inputValidation_1.baseValidation);
    const username = (0, inputValidation_1.validateOptional)(req.query.username, inputValidation_1.baseValidation);
    const email = (0, inputValidation_1.validateOptional)(req.query.email, inputValidation_1.baseValidation);
    const mobileNumber = (0, inputValidation_1.validateOptional)(req.query.mobileNumber, inputValidation_1.baseValidation);
    const role = (0, inputValidation_1.validateOptional)(req.query.role, inputValidation_1.baseValidation);
    const limit = (0, inputValidation_1.validateOptional)(req.query.limit, inputValidation_1.validateLimit);
    const skip = (0, inputValidation_1.validateOptional)(req.query.skip, inputValidation_1.baseValidation);
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
