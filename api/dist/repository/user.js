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
    addSession(id, sessionId) {
        let query = `INSERT INTO sessions(SessionId, UserId) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, [sessionId, id], (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(true);
                }
            });
        });
    },
    getUserFromSession(sessionId) {
        let query = `SELECT UserId FROM sessions WHERE SessionId = ?`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, [sessionId], (err, res) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    reject(err);
                else {
                    if (res.length == 0)
                        resolve(undefined);
                    else {
                        const x = yield exports.UserRepository.retrieveById(res[0].UserId);
                        resolve(x);
                    }
                }
            }));
        });
    },
    retrieveByUsername(username) {
        let query = `SELECT * FROM users WHERE Username = ?`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, [username], (err, res) => {
                if (err)
                    reject(err);
                else {
                    if (res.length == 0)
                        resolve(undefined);
                    else
                        resolve(res[0]);
                }
            });
        });
    },
    retrieveAll(limit, offset) {
        let query = `SELECT u.Id, u.FirstName, u.LastName, u.Username, e.Name as "Role", u.MobileNumber, u.Email FROM users u INNER JOIN roleenum e ON u.Role = e.Id`;
        let values = [];
        if (limit) {
            query += ` LIMIT ?`;
            values.push(limit);
        }
        if (offset) {
            query += ` OFFSET ?`;
            values.push(offset);
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
        let query = `SELECT u.Id, u.FirstName, u.LastName, u.Username, e.Name as "Role", u.MobileNumber, u.Email FROM users u INNER JOIN roleenum e ON u.Role = e.Id WHERE u.Id = ?`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, [id], (err, res) => {
                if (err)
                    reject(err);
                else {
                    if (res.length == 0)
                        resolve(undefined);
                    else
                        resolve(res[0]);
                }
            });
        });
    },
    // The provided id is the session ID so first we must obtain the actual user ID
    upload(sessid, image) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield exports.UserRepository.getUserFromSession(sessid);
            const id = user.Id;
            let query = `INSERT INTO picture(Picture) VALUES(?)`;
            return new Promise((resolve, reject) => {
                connection_1.default.execute(query, [image], (err, res) => {
                    if (err)
                        reject(err);
                    else {
                        const fk = res.insertId;
                        // Cleanup a bit by removing the old BLOB if the user had this 
                        query = `SELECT PictureId from users WHERE Id = ?`;
                        connection_1.default.execute(query, [id], (err, res) => {
                            if (err)
                                reject(err);
                            if (res.length > 0) {
                                query = `DELETE FROM picture WHERE Id = ?`,
                                    [res[0].PictureId];
                                connection_1.default.execute(query, (err, res) => {
                                    if (err)
                                        reject(err);
                                });
                            }
                        });
                        query = `UPDATE users SET PictureId = ? WHERE Id = ?`,
                            connection_1.default.execute(query, [fk, id], (err, res) => {
                                if (err)
                                    reject(err);
                                resolve(fk);
                            });
                    }
                });
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
        let query = `DELETE FROM sessions WHERE UserId = ?; DELETE FROM users WHERE id = ?; `;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, [id, id], (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(id);
                }
            });
        });
    },
    deleteSession(id) {
        let query = `DELETE FROM sessions WHERE SessionId = ?`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, [id], (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(1);
                }
            });
        });
    }
};
