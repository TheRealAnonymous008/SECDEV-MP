"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bcrypt = require("bcryptjs");
const transaction_1 = require("../txn/transaction");
const register = (req, res) => {
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
            res.end();
        });
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
};
exports.default = { register };
