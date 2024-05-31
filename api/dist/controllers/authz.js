"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bcrypt = require("bcryptjs");
const transaction_1 = require("../txn/transaction");
const enum_1 = require("../models/enum");
const register = (req, res) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        password: Bcrypt.hashSync(req.body.password, 10),
        role: enum_1.Roles.ADMIN
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
    (0, transaction_1.executeTransaction)([(0, transaction_1.buildTransactionStatement)(query, values)])
        .then((result) => {
        res.end();
    }).catch((err) => {
        console.log(err);
        res.end();
    });
};
exports.default = { register };
