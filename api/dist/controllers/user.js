"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("../txn/transaction");
const crypto_1 = require("crypto");
const create = (req, res) => {
    const id = (0, crypto_1.randomUUID)();
    (0, transaction_1.executeTransaction)([])
        .then((result) => {
        console.log(result);
    })
        .catch((err) => {
        console.log(err);
    })
        .finally(() => {
        res.json(Object.assign({ id: id }, req.body));
        res.end();
    });
};
