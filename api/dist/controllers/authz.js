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
const transaction_1 = require("../txn/transaction");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        password: Bcrypt.hashSync(req.body.password, 10),
        role: req.body.role
    };
    const query = `
      INSERT INTO "Users" ("FirstName", "LastName", "Username", "Password", "Role", "MobileNumber", "Email")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING "Id";
    `;
    const values = [
        user.firstName,
        user.lastName,
        user.username,
        user.password,
        user.role,
        user.mobileNumber,
        user.email,
    ];
    try {
        (0, transaction_1.executeTransaction)([
            (0, transaction_1.buildTransactionStatement)(query, values)
        ], () => {
            res.status(200).end();
        })
            .then((result) => {
            console.log(result);
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});
exports.default = { register };
