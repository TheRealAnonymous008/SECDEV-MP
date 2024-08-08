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
exports.makeSQLQuery = exports.ExpensesRepository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const dbUtils_1 = require("../utils/dbUtils");
const limiterConfig_1 = require("../config/limiterConfig");
const EXPENSES_TABLE_NAME = "expenses";
exports.ExpensesRepository = {
    retrieveAll(limit = limiterConfig_1.LIMIT_MAX, offset) {
        let qv = dbUtils_1.queryBuilder.select(EXPENSES_TABLE_NAME);
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
        let qv = dbUtils_1.queryBuilder.select(EXPENSES_TABLE_NAME);
        dbUtils_1.queryBuilder.where(qv, { Id: id });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res[0]);
            });
        });
    },
    insert(expense) {
        return __awaiter(this, void 0, void 0, function* () {
            let qv = dbUtils_1.queryBuilder.insert(EXPENSES_TABLE_NAME, {
                InvoiceAmount: expense.InvoiceAmount,
                InvoiceDeductible: expense.InvoiceDeductible,
                AgentFirstName: expense.AgentFirstName,
                AgentLastName: expense.AgentLastName,
                DatePaid: expense.DatePaid,
                AgentCommission: expense.AgentCommission,
            });
            return new Promise((resolve, reject) => {
                connection_1.default.execute(qv.query, qv.values, (err, res) => {
                    if (err)
                        reject(err);
                    else
                        resolve(res.insertId);
                });
            });
        });
    },
    update(id, expense) {
        return __awaiter(this, void 0, void 0, function* () {
            let qv = dbUtils_1.queryBuilder.update(EXPENSES_TABLE_NAME, {
                InvoiceAmount: expense.InvoiceAmount,
                InvoiceDeductible: expense.InvoiceDeductible,
                AgentFirstName: expense.AgentFirstName,
                AgentLastName: expense.AgentLastName,
                DatePaid: expense.DatePaid,
                AgentCommission: expense.AgentCommission,
            });
            dbUtils_1.queryBuilder.where(qv, { Id: id });
            return new Promise((resolve, reject) => {
                connection_1.default.execute(qv.query, qv.values, (err, res) => {
                    if (err)
                        reject(err);
                    else
                        resolve(id);
                });
            });
        });
    },
    delete(id) {
        let qv = dbUtils_1.queryBuilder.delete(EXPENSES_TABLE_NAME);
        dbUtils_1.queryBuilder.where(qv, { Id: id });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(id);
            });
        });
    },
    filter(query) {
        let qv = (0, exports.makeSQLQuery)(query);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    },
};
const makeSQLQuery = (query) => {
    let qv = dbUtils_1.queryBuilder.select(EXPENSES_TABLE_NAME);
    dbUtils_1.queryBuilder.filter(qv, {
        InvoiceAmount: query.InvoiceAmount,
        InvoiceDeductible: query.InvoiceDeductible,
        AgentFirstName: query.AgentFirstName,
        AgentLastName: query.AgentLastName,
        DatePaid: query.DatePaid,
        AgentCommission: query.AgentCommission
    });
    dbUtils_1.queryBuilder.limit(qv, query.limit);
    dbUtils_1.queryBuilder.skip(qv, query.skip);
    return qv;
};
exports.makeSQLQuery = makeSQLQuery;
