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
exports.TypeEnumRepository = exports.StatusEnumRepository = exports.RoleEnumRepository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const limiterConfig_1 = require("../config/limiterConfig");
const dbUtils_1 = require("../utils/dbUtils");
const createEnumRepository = (tableName) => {
    return {
        tableName,
        retrieveAll(limit = limiterConfig_1.LIMIT_MAX, offset) {
            return __awaiter(this, void 0, void 0, function* () {
                let qv = dbUtils_1.queryBuilder.select(this.tableName);
                dbUtils_1.queryBuilder.limit(qv, limit);
                dbUtils_1.queryBuilder.skip(qv, offset);
                try {
                    const res = yield new Promise((resolve, reject) => {
                        connection_1.default.execute(qv.query, qv.values, (err, results) => {
                            if (err)
                                reject(err);
                            else
                                resolve(results);
                        });
                    });
                    return res;
                }
                catch (error) {
                    console.error(`Error retrieving all from ${this.tableName}:`, error);
                    throw error;
                }
            });
        },
        retrieveByName(name) {
            return __awaiter(this, void 0, void 0, function* () {
                let qv = dbUtils_1.queryBuilder.select(this.tableName);
                dbUtils_1.queryBuilder.where(qv, { "Name": name });
                try {
                    const res = yield new Promise((resolve, reject) => {
                        connection_1.default.execute(qv.query, qv.values, (err, results) => {
                            if (err)
                                reject(err);
                            else
                                resolve(results);
                        });
                    });
                    return res.length > 0 ? res[0] : undefined;
                }
                catch (error) {
                    console.error(`Error retrieving ${name} from ${this.tableName}:`, error);
                    throw error;
                }
            });
        },
        retrieveById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                let qv = dbUtils_1.queryBuilder.select(this.tableName);
                dbUtils_1.queryBuilder.where(qv, { "id": id });
                try {
                    const res = yield new Promise((resolve, reject) => {
                        connection_1.default.execute(qv.query, qv.values, (err, results) => {
                            if (err)
                                reject(err);
                            else
                                resolve(results);
                        });
                    });
                    return res.length > 0 ? res[0] : undefined;
                }
                catch (error) {
                    console.error(`Error retrieving ${id} from ${this.tableName}:`, error);
                    throw error;
                }
            });
        },
    };
};
exports.RoleEnumRepository = createEnumRepository("RoleEnum");
exports.StatusEnumRepository = createEnumRepository("StatusEnum");
exports.TypeEnumRepository = createEnumRepository("TypeEnum");
