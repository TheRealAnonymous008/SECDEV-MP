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
            user.firstName,
            user.lastName,
            user.username,
            user.password,
            user.salt,
            user.role,
            user.email,
            user.mobileNumber
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
};
