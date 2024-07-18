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
exports.OrderRespository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const limiterConfig_1 = require("../config/limiterConfig");
const dbUtils_1 = require("../utils/dbUtils");
const enums_1 = require("./enums");
const fileUtils_1 = require("../utils/fileUtils");
const ORDER_TABLE_NAME = "order";
exports.OrderRespository = {
    retrieveAll(limit = limiterConfig_1.LIMIT_MAX, offset) {
        let qv = dbUtils_1.queryBuilder.select(ORDER_TABLE_NAME);
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
        let qv = dbUtils_1.queryBuilder.select(ORDER_TABLE_NAME);
        dbUtils_1.queryBuilder.where(qv, { Id: id });
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
        return __awaiter(this, void 0, void 0, function* () {
            // It is assumed status and Time are IDs
            try {
                if (object.Invoice) {
                    (0, fileUtils_1.storeFile)(object.Invoice, "pdf");
                }
                let qv = dbUtils_1.queryBuilder.insert(ORDER_TABLE_NAME, {
                    Status: (yield enums_1.StatusEnumRepository.retrieveByName(object.Status)).Id,
                    TimeIn: object.TimeIn,
                    TimeOut: object.TimeOut,
                    CustomerId: object.CustomerId,
                    TypeId: (yield enums_1.TypeEnumRepository.retrieveByName(object.TypeId)).Id,
                    VehicleId: object.VehicleId,
                    EstimateNumber: object.EstimateNumber,
                    ScopeOfWork: object.ScopeOfWork,
                    IsVerified: object.IsVerified,
                    Invoice: object.Invoice.filename,
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
            }
            catch (e) {
                console.log(e);
            }
        });
    },
    update(id, object) {
        return __awaiter(this, void 0, void 0, function* () {
            let qv = dbUtils_1.queryBuilder.update(ORDER_TABLE_NAME, {
                Status: (yield enums_1.StatusEnumRepository.retrieveByName(object.Status)).Id,
                TimeIn: object.TimeIn,
                TimeOut: object.TimeOut,
                CustomerId: object.CustomerId,
                TypeId: (yield enums_1.TypeEnumRepository.retrieveByName(object.TypeId)).Id,
                VehicleId: object.VehicleId,
                EstimateNumber: object.EstimateNumber,
                ScopeOfWork: object.ScopeOfWork,
                IsVerified: object.IsVerified
            });
            dbUtils_1.queryBuilder.where(qv, { Id: id });
            return new Promise((resolve, reject) => {
                connection_1.default.execute(qv.query, qv.values, (err, res) => {
                    if (err)
                        reject(err);
                    else {
                        resolve(id);
                    }
                });
            });
        });
    },
    delete(id) {
        let qv = dbUtils_1.queryBuilder.delete(ORDER_TABLE_NAME);
        dbUtils_1.queryBuilder.where(qv, { Id: id });
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
        let qv = dbUtils_1.queryBuilder.count(ORDER_TABLE_NAME);
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
        // Placeholder for filter implementation
        let values = [];
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res);
                }
            });
        });
    }
};
