"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
exports.UserRepository = {
    register(user) {
        let values = [
            user.FirstName,
            user.LastName,
            user.Username,
            user.Password,
            user.Salt,
            user.Role,
            user.Email,
            user.MobileNumber
        ];
        let query = "INSERT INTO users(FirstName, LastName, Username, Password, Salt ,Role, Email, MobileNumber) \
        VALUES(?, ?, ?, ?, ?, ?, ?, ?);";
        console.log(query);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res.insertId);
                }
            });
        });
    },
    retrieveByUsername(username) {
        let query = `SELECT * FROM users WHERE Username = "${username}"`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res[0]);
                }
            });
        });
    },
};
