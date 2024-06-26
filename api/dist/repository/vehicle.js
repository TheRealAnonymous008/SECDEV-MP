"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSQLQuery = exports.VehicleRepository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const match_1 = require("../utils/match");
exports.VehicleRepository = {
    retrieveAll(limit, offset) {
        let query = "SELECT * FROM vehicle";
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
        let query = `SELECT * FROM vehicle WHERE Id = ?`;
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
            object.LicensePlate,
            object.Model,
            object.Manufacturer,
            object.YearManufactured,
            object.Color,
            object.Engine,
            object.Remarks
        ];
        let query = "INSERT INTO vehicle(LicensePlate, Model, Manufacturer, YearManufactured, Color, Engine, Remarks) \
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
            object.LicensePlate,
            object.Model,
            object.Manufacturer,
            object.YearManufactured,
            object.Color,
            object.Engine,
            object.Remarks,
            id
        ];
        let query = "UPDATE vehicle SET LicensePlate = ?, Model = ?, Manufacturer = ?, YearManufactured = ?, Color = ?, Engine = ?, Remarks = ? WHERE Id=?";
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
        let query = `DELETE FROM vehicle WHERE id = ?`;
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
    let q = `SELECT * FROM vehicle`;
    let whereClauses = [];
    let values = [];
    if (query.licensePlate) {
        whereClauses.push(`LicensePlate LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.licensePlate));
    }
    if (query.model) {
        whereClauses.push(`Model LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.model));
    }
    if (query.manufacturer) {
        whereClauses.push(`Manufacturer LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.manufacturer));
    }
    if (query.yearManufactured !== undefined) {
        whereClauses.push(`YearManufactured = ?`);
        values.push(query.yearManufactured);
    }
    if (query.color) {
        whereClauses.push(`Color LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.color));
    }
    if (query.engine) {
        whereClauses.push(`Engine LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.engine));
    }
    if (query.remarks) {
        whereClauses.push(`Remarks LIKE ?`);
        values.push((0, match_1.buildMatchString)(query.remarks));
    }
    if (whereClauses.length > 0) {
        q += " WHERE " + whereClauses.join(" AND ");
    }
    if (query.limit !== undefined) {
        q += ` LIMIT ?`;
        values.push(query.limit);
    }
    if (query.skip !== undefined) {
        q += ` OFFSET ?`;
        values.push(query.skip);
    }
    return { query: q, values: values };
};
exports.makeSQLQuery = makeSQLQuery;
