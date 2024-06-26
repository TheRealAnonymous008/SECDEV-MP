"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSQLQuery = exports.CustomerRepository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const match_1 = require("../utils/match");
exports.CustomerRepository = {
    retrieveAll(limit, offset) {
        let query = "SELECT * FROM customer";
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
            connection_1.default.execute(query, values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res);
                }
            });
        });
    },
    retrieveById(id) {
        let query = `SELECT * FROM customer WHERE Id = ?`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, [id], (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res[0]);
                }
            });
        });
    },
    insert(object) {
        let values = [
            object.FirstName,
            object.LastName,
            object.MobileNumber,
            object.Email,
            object.Company,
            object.Insurance,
            object.Remarks
        ];
        let query = "INSERT INTO customer(FirstName, LastName, MobileNumber, Email, Company, Insurance, Remarks) \
        VALUES(?, ?, ?, ?, ?, ?, ?);";
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
    update(id, object) {
        let values = [
            object.FirstName,
            object.LastName,
            object.MobileNumber,
            object.Email,
            object.Company,
            object.Insurance,
            object.Remarks,
            id
        ];
        let query = "UPDATE customer SET FirstName = ?, LastName = ?, MobileNumber = ?, Email = ?, Company = ?, Insurance = ?, Remarks = ? WHERE Id=?";
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
        let query = `DELETE FROM customer WHERE id = ?`;
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, [id], (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(id);
                }
            });
        });
    },
    count() {
        let query = "SELECT COUNT(*) FROM vehicle";
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res[0]['COUNT(*)']);
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
    let q = `SELECT * FROM customer`;
    let whereClauses = [];
    let values = [];
    if (query.name) {
        whereClauses.push(`CONCAT(FirstName, LastName) LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.name));
    }
    if (query.email) {
        whereClauses.push(`Email LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.email));
    }
    if (query.mobileNumber) {
        whereClauses.push(`MobileNumber LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.mobileNumber));
    }
    if (query.company) {
        whereClauses.push(`Company LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.company));
    }
    if (query.insurance) {
        whereClauses.push(`Insurance LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.insurance));
    }
    if (query.remarks) {
        whereClauses.push(`Remarks LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.remarks));
    }
    if (whereClauses.length > 0) {
        q += " WHERE " + whereClauses.join(" AND ");
    }
    if (query.limit) {
        q += ` LIMIT ?`;
        values.push(query.limit);
    }
    if (query.skip) {
        q += ` OFFSET ?`;
        values.push(query.skip);
    }
    return { query: q, values: values };
};
exports.makeSQLQuery = makeSQLQuery;
