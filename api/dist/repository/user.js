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
    verifyRole(username, role) {
        let query = `SELECT * FROM users JOIN roleenum ON users.Role = roleenum.Id WHERE Username = "${username}" AND Name = "${role.toUpperCase()}"`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res.length > 0);
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
    retrieveAll(limit, offset) {
        let query = `SELECT u.Id, u.FirstName, u.LastName, u.Username, e.Name as "Role", u.MobileNumber, u.Email FROM users u INNER JOIN roleenum e ON u.Role = e.Id;`;
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
    retrieveById(id) {
        let query = `SELECT u.Id, u.FirstName, u.LastName, u.Username, e.Name as "Role", u.MobileNumber, u.Email FROM users u INNER JOIN roleenum e ON u.Role = e.Id; WHERE u.Id = ${id}`;
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
    upload(id, image) {
        let query = `INSERT INTO picture(Picture) VALUES(?)`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, [image], (err, res) => {
                if (err)
                    reject(err);
                else {
                    const fk = res.insertId;
                    let q2 = `UPDATE users SET PictureId =${fk} WHERE Id = ${id}`;
                    connection_1.default.execute(q2, (err, res) => {
                        if (err)
                            reject(err);
                        resolve(fk);
                    });
                }
            });
        });
    },
    update(id, object) {
        let values = [
            object.FirstName,
            object.LastName,
            object.Username,
            object.Role,
            object.Email,
            object.MobileNumber,
            id
        ];
        let query = "UPDATE users SET FirstName = ?, LastName = ?, Username = ?, Role = ?, Email = ?, MobileNubmer = ? WHERE Id=?";
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(id);
                }
            });
        });
    },
    delete(id) {
        let query = `DELETE FROM users WHERE id = ${id}`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(id);
                }
            });
        });
    }
};
