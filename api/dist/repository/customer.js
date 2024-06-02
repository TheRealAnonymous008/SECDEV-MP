"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
;
exports.CustomerRepository = {
    retrieveAll(limit, offset) {
        let query = "SELECT * FROM customer";
        if (limit) {
            query += ` LIMIT ${limit}`;
        }
        if (offset) {
            query += ` OFFST ${offset}`;
        }
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res);
                }
            });
        });
    },
    retieveById(id) {
        let query = `SELECT * FROM customer WHERE Id = ${id}`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res[0]);
                }
            });
        });
    }
    // insert(object : Customer) : Promise<Customer> {
    // }
    // update(id : number, object : Customer) : Promise<number> {
    // }
    // delete(id : number) : Promise<number> {
    // }
};
