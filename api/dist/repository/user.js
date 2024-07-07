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
exports.makeSQLQuery = exports.UserRepository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const authConfig_1 = require("../config/authConfig");
const limiterConfig_1 = require("../config/limiterConfig");
const dbUtils_1 = require("../utils/dbUtils");
const cryptoUtils_1 = require("../utils/cryptoUtils");
const tableName = "users";
exports.UserRepository = {
    register(user) {
        let qv = dbUtils_1.queryBuilder.insert(tableName, {
            "FirstName": user.FirstName,
            "LastName": user.LastName,
            "Username": user.Username,
            "Password": user.Password,
            "Salt": user.Salt,
            "Role": user.Role,
            "Email": user.Email,
            "MobileNumber": user.MobileNumber
        });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res.insertId);
                }
            });
        });
    },
    addSession(id, sessionId) {
        // Make sure to hash the session ID
        sessionId = (0, cryptoUtils_1.hashSessionId)(sessionId);
        const sessionTime = new Date().getTime();
        let qv = dbUtils_1.queryBuilder.insert("sessions", {
            "SessionId": sessionId,
            "UserId": id,
            "SessionTime": sessionTime
        });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(true);
                }
            });
        });
    },
    getUserFromSession(sessionId) {
        let qv = dbUtils_1.queryBuilder.select("sessions", ["UserId"]);
        sessionId = (0, cryptoUtils_1.hashSessionId)(sessionId);
        const currentTime = new Date().getTime();
        dbUtils_1.queryBuilder.where(qv, { "SessionId": sessionId });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    reject(err);
                else {
                    if (res.length == 0)
                        resolve(undefined);
                    else if (currentTime - parseInt(res[0].SessionTime) > authConfig_1.SESSION_EXPIRE_TIME) {
                        resolve(undefined);
                    }
                    else {
                        const x = yield exports.UserRepository.retrieveById(res[0].UserId);
                        resolve(x);
                    }
                }
            }));
        });
    },
    retrieveByUsername(username) {
        let qv = dbUtils_1.queryBuilder.select("users");
        dbUtils_1.queryBuilder.where(qv, { "Username": username });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
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
    retrieveAll(limit = limiterConfig_1.LIMIT_MAX, offset) {
        let qv = dbUtils_1.queryBuilder.select("users u INNER JOIN roleenum e ON u.Role = e.Id", [
            "u.Id",
            "u.FirstName",
            "u.LastName",
            "u.Username",
            `e.Name as "Role"`,
            "u.MobileNumber",
            "u.Email"
        ]);
        dbUtils_1.queryBuilder.limit(qv, limit);
        dbUtils_1.queryBuilder.skip(qv, offset);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res);
                }
            });
        });
    },
    retrieveById(id) {
        let qv = dbUtils_1.queryBuilder.select(tableName, [
            "u.Id",
            "u.FirstName",
            "u.LastName",
            "u.Username",
            "u.Role",
            "u.MobileNumber",
            "u.Email"
        ]);
        dbUtils_1.queryBuilder.where(qv, { "id": id });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
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
    // TODO: Need to change how this works.
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
        let qv = dbUtils_1.queryBuilder.update(tableName, {
            "FirstName": object.FirstName,
            "LastName": object.LastName,
            "Username": object.Username,
            "Role": object.Role,
            "Email": object.Email,
            "MobileNumber": object.MobileNumber
        });
        dbUtils_1.queryBuilder.where(qv, { "Id": id });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(id);
                }
            });
        });
    },
    delete(id) {
        let qv1 = dbUtils_1.queryBuilder.delete("sessions");
        dbUtils_1.queryBuilder.where(qv1, { "UserId": id });
        let qv2 = dbUtils_1.queryBuilder.delete(tableName);
        dbUtils_1.queryBuilder.where(qv2, { "Id": id });
        let qv = dbUtils_1.queryBuilder.concat(qv1, qv2);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(id);
                }
            });
        });
    },
    deleteSession(sessionId) {
        sessionId = (0, cryptoUtils_1.hashSessionId)(sessionId);
        let query = `DELETE FROM sessions WHERE SessionId = ?`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, [sessionId], (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(1);
                }
            });
        });
    },
    filter(query) {
        let qv = (0, exports.makeSQLQuery)(query);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res);
                }
            });
        });
    }
};
const makeSQLQuery = (query) => {
    let qv = dbUtils_1.queryBuilder.select(tableName);
    dbUtils_1.queryBuilder.filter(qv, {
        "CONCAT(FirstName, LastName)": query.name,
        "Email": query.email,
        "MobileNumber": query.mobileNumber,
        "Username": query.username
    });
    dbUtils_1.queryBuilder.limit(qv, query.limit);
    dbUtils_1.queryBuilder.skip(qv, query.skip);
    return qv;
};
exports.makeSQLQuery = makeSQLQuery;
