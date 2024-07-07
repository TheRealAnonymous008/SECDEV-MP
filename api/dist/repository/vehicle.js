"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSQLQuery = exports.VehicleRepository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const limiterConfig_1 = require("../config/limiterConfig");
const dbUtils_1 = require("../utils/dbUtils");
const tableName = "vehicle";
exports.VehicleRepository = {
    retrieveAll(limit = limiterConfig_1.LIMIT_MAX, offset) {
        let qv = dbUtils_1.queryBuilder.select(tableName);
        dbUtils_1.queryBuilder.limit(qv, limit),
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
        let qv = dbUtils_1.queryBuilder.select(tableName);
        dbUtils_1.queryBuilder.where(qv, { "Id": id });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res[0]);
                }
            });
        });
    },
    insert(object) {
        let qv = dbUtils_1.queryBuilder.insert(tableName, {
            "LicensePlate": object.LicensePlate,
            "Model": object.Model,
            "Manufacturer": object.Manufacturer,
            "YearManufactured": object.YearManufactured,
            "Color": object.Color,
            "Engine": object.Engine,
            "Remarks": object.Remarks
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
    update(id, object) {
        let qv = dbUtils_1.queryBuilder.update(tableName, {
            "LicensePlate": object.LicensePlate,
            "Model": object.Model,
            "Manufacturer": object.Manufacturer,
            "YearManufactured": object.YearManufactured,
            "Color": object.Color,
            "Engine": object.Engine,
            "Remarks": object.Remarks
        });
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
        let qv = dbUtils_1.queryBuilder.delete(tableName);
        dbUtils_1.queryBuilder.where(qv, { "id": id });
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
    count() {
        let qv = dbUtils_1.queryBuilder.count(tableName);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
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
    let qv = dbUtils_1.queryBuilder.select(tableName);
    dbUtils_1.queryBuilder.filter(qv, {
        "LicensePlate": query.licensePlate,
        "Model": query.model,
        "Manufacturer": query.manufacturer,
        "YearManufactured": query.yearManufactured,
        "Color": query.color,
        "Engine": query.engine,
        "Remarks": query.remarks
    });
    dbUtils_1.queryBuilder.limit(qv, query.limit);
    dbUtils_1.queryBuilder.skip(qv, query.skip);
    return qv;
};
exports.makeSQLQuery = makeSQLQuery;
