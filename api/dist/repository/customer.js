"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
;
exports.CustomerRepository = {
    retrieveAll() {
        return new Promise((resolve, reject) => {
            connection_1.default.query(`SELECT * FROM customer;`, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res);
                }
            });
        });
    }
    // retieveById(id :  number) : Promise<Customer | undefined> {
    // }
    // insert(object : Customer) : Promise<Customer> {
    // }
    // update(id : number, object : Customer) : Promise<number> {
    // }
    // delete(id : number) : Promise<number> {
    // }
};
