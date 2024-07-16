"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeEnumRepository = exports.StatusEnumRepository = exports.RoleEnumRepository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const limiterConfig_1 = require("../config/limiterConfig");
const dbUtils_1 = require("../utils/dbUtils");
exports.RoleEnumRepository = {
    retrieveAll(limit = limiterConfig_1.LIMIT_MAX, offset) {
        let qv = dbUtils_1.queryBuilder.select("autoworks.RoleEnum");
        dbUtils_1.queryBuilder.limit(qv, limit);
        dbUtils_1.queryBuilder.skip(qv, offset);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    },
    retrieveById(id) {
        let qv = dbUtils_1.queryBuilder.select("autoworks.RoleEnum");
        dbUtils_1.queryBuilder.where(qv, { "Id": id });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.length > 0 ? res[0] : undefined);
            });
        });
    },
};
exports.StatusEnumRepository = {
    retrieveAll(limit = limiterConfig_1.LIMIT_MAX, offset) {
        let qv = dbUtils_1.queryBuilder.select("autoworks.StatusEnum");
        dbUtils_1.queryBuilder.limit(qv, limit);
        dbUtils_1.queryBuilder.skip(qv, offset);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    },
    retrieveById(id) {
        let qv = dbUtils_1.queryBuilder.select("autoworks.StatusEnum");
        dbUtils_1.queryBuilder.where(qv, { "Id": id });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.length > 0 ? res[0] : undefined);
            });
        });
    },
};
exports.TypeEnumRepository = {
    retrieveAll(limit = limiterConfig_1.LIMIT_MAX, offset) {
        let qv = dbUtils_1.queryBuilder.select("autoworks.TypeEnum");
        dbUtils_1.queryBuilder.limit(qv, limit);
        dbUtils_1.queryBuilder.skip(qv, offset);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    },
    retrieveById(id) {
        let qv = dbUtils_1.queryBuilder.select("autoworks.TypeEnum");
        dbUtils_1.queryBuilder.where(qv, { "Id": id });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.length > 0 ? res[0] : undefined);
            });
        });
    },
};
