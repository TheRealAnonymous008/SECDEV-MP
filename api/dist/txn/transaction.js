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
exports.TransactionFailedException = exports.executeTransaction = exports.buildTransactionStatement = void 0;
const postgres_1 = require("@vercel/postgres");
const buildTransactionStatement = (statement, values = []) => {
    return {
        statement: statement,
        values: values
    };
};
exports.buildTransactionStatement = buildTransactionStatement;
const executeTransaction = (body, errhandler) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Called", body);
        const client = yield postgres_1.db.connect();
        const results = [];
        yield client.query(`BEGIN;`);
        body.forEach((txn) => __awaiter(void 0, void 0, void 0, function* () {
            if (txn.values && txn.values.length > 0) {
                yield client.query(txn.statement, txn.values)
                    .then(result => {
                    results.push(result);
                })
                    .catch(error => {
                    console.log(error);
                    if (errhandler)
                        errhandler();
                });
            }
            else {
                yield client.query(txn.statement)
                    .then(result => {
                    results.push(result);
                })
                    .catch(error => {
                    console.log(error);
                    if (errhandler)
                        errhandler();
                });
            }
        }));
        yield client.query(`END;`);
        return results;
    }
    catch (error) {
        if (errhandler)
            errhandler();
    }
});
exports.executeTransaction = executeTransaction;
class TransactionFailedException extends Error {
    constructor(msg) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, TransactionFailedException.prototype);
    }
}
exports.TransactionFailedException = TransactionFailedException;
