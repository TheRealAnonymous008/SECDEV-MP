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
const fileUtils_1 = require("../utils/fileUtils");
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
    addSession(id, sessionId, csrf) {
        // Make sure to hash the session ID
        sessionId = (0, cryptoUtils_1.hashId)(sessionId);
        csrf = (0, cryptoUtils_1.hashId)(csrf);
        const sessionTime = (0, cryptoUtils_1.getTimestamp)();
        let qv = dbUtils_1.queryBuilder.insert("sessions", {
            "SessionId": sessionId,
            "UserId": id,
            "SessionTime": sessionTime,
            "Csrf": csrf,
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
    // We include the CSRF validation here. It is as if every request requires us to validate with the csrf token as well
    getUserFromSession(sessionId, csrf) {
        let qv = dbUtils_1.queryBuilder.select("sessions");
        const h_sessionId = (0, cryptoUtils_1.hashId)(sessionId);
        const currentTime = (0, cryptoUtils_1.getTimestamp)();
        if (csrf) {
            csrf = (0, cryptoUtils_1.hashId)(csrf);
            dbUtils_1.queryBuilder.where(qv, { "SessionId": h_sessionId, "Csrf": csrf });
        }
        else {
            dbUtils_1.queryBuilder.where(qv, { "SessionId": h_sessionId });
        }
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    reject(err);
                else {
                    if (res.length == 0)
                        resolve(undefined);
                    else if (currentTime - parseInt(res[0].SessionTime) > authConfig_1.SESSION_EXPIRE_TIME) {
                        const x = yield exports.UserRepository.deleteSession(sessionId);
                        resolve(undefined);
                    }
                    else {
                        exports.UserRepository.retrieveById(res[0].UserId)
                            .then((user) => { resolve(user); })
                            .catch((err) => { reject(err); });
                    }
                }
            }));
        });
    },
    // Mechanism for refreshing the CSRF token 
    refreshCSRF(sessionId) {
        let csrf = (0, cryptoUtils_1.getRandom)();
        let qv = dbUtils_1.queryBuilder.update("sessions", { "Csrf": (0, cryptoUtils_1.hashId)(csrf) });
        sessionId = (0, cryptoUtils_1.hashId)(sessionId);
        dbUtils_1.queryBuilder.where(qv, { "SessionId": sessionId });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    reject(err);
                else {
                    resolve(csrf);
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
        let qv = dbUtils_1.queryBuilder.select("users u", [
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
    // The provided id is the session ID so first we must obtain the actual user ID
    upload(sessid, csrf, image) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield exports.UserRepository.getUserFromSession(sessid, csrf);
            const id = user.Id;
            return new Promise((resolve, reject) => {
                try {
                    (0, fileUtils_1.storeFile)(image, "png");
                }
                catch (err) {
                    reject(err);
                }
                let qv = dbUtils_1.queryBuilder.update("users", { "Picture": image.filename });
                dbUtils_1.queryBuilder.where(qv, { "Id": id });
                connection_1.default.execute(qv.query, qv.values, (err, res) => {
                    if (err)
                        reject(err);
                    else {
                        resolve(res.insertId);
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
        let qv1 = dbUtils_1.queryBuilder.delete(tableName);
        dbUtils_1.queryBuilder.where(qv1, { "Id": id });
        let qv2 = dbUtils_1.queryBuilder.delete("sessions");
        dbUtils_1.queryBuilder.where(qv2, { "UserId": id });
        let qv = dbUtils_1.queryBuilder.concat(qv1, qv2);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv1.query, qv1.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    connection_1.default.execute(qv2.query, qv2.values, (err, res) => {
                        if (err)
                            reject(err);
                        else {
                            resolve(id);
                        }
                    });
                }
            });
        });
    },
    deleteSession(sessionId) {
        sessionId = (0, cryptoUtils_1.hashId)(sessionId);
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
