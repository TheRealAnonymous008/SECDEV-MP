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
const expenses_1 = require("../repository/expenses");
const logger_1 = __importDefault(require("../utils/logger"));
const logConfig_1 = require("../config/logConfig");
const inputValidation_1 = require("../middleware/inputValidation");
const expenses_2 = require("../projections/expenses");
const all = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        expenses_1.ExpensesRepository.retrieveAll()
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield (0, expenses_2.makeExpenseArrayView)(result);
            res.json({
                data: data,
                count: result.length
            });
            res.status(200).end();
        }))
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving all expenses: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving all expenses: ${err.message}`);
        next(err);
    }
});
const id = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        expenses_1.ExpensesRepository.retrieveById(id)
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (result.length == 0) {
                res.status(404).end();
                return;
            }
            res.json(yield (0, expenses_2.makeExpenseView)(result));
            res.status(200).end();
        }))
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving expense by id: ${err.message}`);
            next(err);
        });
    }
    catch (error) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving expense by id: ${error.message}`);
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = {
            InvoiceAmount: (0, inputValidation_1.validateRequired)(req.body.InvoiceAmount, inputValidation_1.validateFloat),
            InvoiceDeductible: (0, inputValidation_1.validateRequired)(req.body.InvoiceDeductible, inputValidation_1.validateFloat),
            AgentFirstName: (0, inputValidation_1.validateRequired)(req.body.AgentFirstName, inputValidation_1.validateName),
            AgentLastName: (0, inputValidation_1.validateRequired)(req.body.AgentLastName, inputValidation_1.validateName),
            DatePaid: (0, inputValidation_1.validateRequired)(req.body.DatePaid, inputValidation_1.validateDate),
            AgentCommission: (0, inputValidation_1.validateRequired)(req.body.AgentCommission, inputValidation_1.validateFloat),
        };
        expenses_1.ExpensesRepository.insert(expense)
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (result = undefined) {
                throw new Error(`Failed to create order with params ${expense}`);
            }
            res.json(yield (0, expenses_2.makeExpenseView)(Object.assign(Object.assign({}, expense), { Id: result })));
            res.status(200).end();
        }))
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error creating expense: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error creating expense: ${err.message}`);
        next(err);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = {
            InvoiceAmount: (0, inputValidation_1.validateRequired)(req.body.InvoiceAmount, inputValidation_1.validateFloat),
            InvoiceDeductible: (0, inputValidation_1.validateRequired)(req.body.InvoiceDeductible, inputValidation_1.validateFloat),
            AgentFirstName: (0, inputValidation_1.validateRequired)(req.body.AgentFirstName, inputValidation_1.validateName),
            AgentLastName: (0, inputValidation_1.validateRequired)(req.body.AgentLastName, inputValidation_1.validateName),
            DatePaid: (0, inputValidation_1.validateRequired)(req.body.DatePaid, inputValidation_1.validateDate),
            AgentCommission: (0, inputValidation_1.validateRequired)(req.body.AgentCommission, inputValidation_1.validateFloat),
        };
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        expenses_1.ExpensesRepository.update(id, expense)
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (result == undefined) {
                throw new Error(`Failed to update expense with id ${id}`);
            }
            res.json(yield (0, expenses_2.makeExpenseView)(Object.assign(Object.assign({}, expense), { Id: result })));
            res.status(200).end();
        }))
            .catch((err) => {
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error updating expense: ${err.message}`);
        next(err);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        expenses_1.ExpensesRepository.delete(id)
            .then((result) => {
            if (result == undefined) {
                throw new Error(`Failed to delete expense with id ${id}`);
            }
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Expense deleted: ${id}`);
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error deleting expense with id ${id}: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error deleting expense with id ${id}: ${err.message}`);
        next(err);
    }
});
const filter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = makeQuery(req);
        expenses_1.ExpensesRepository.filter(query)
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            res.json({
                data: yield (0, expenses_2.makeExpenseArrayView)(result),
                count: result.length
            });
            res.status(200).end();
        }))
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error filtering expenses: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error filtering expenses: ${err.message}`);
        next(err);
    }
});
const makeQuery = (req) => {
    const invoiceAmount = (0, inputValidation_1.validateOptional)(req.query.InvoiceAmount, inputValidation_1.validateFloat);
    const invoiceDeductible = (0, inputValidation_1.validateOptional)(req.query.InvoiceDeductible, inputValidation_1.validateFloat);
    const agentFirstName = (0, inputValidation_1.validateOptional)(req.query.AgentFirstName, inputValidation_1.validateName);
    const agentLastName = (0, inputValidation_1.validateOptional)(req.query.AgentLastName, inputValidation_1.validateName);
    const datePaid = (0, inputValidation_1.validateOptional)(req.query.DatePaid, inputValidation_1.validateDate);
    const agentCommission = (0, inputValidation_1.validateOptional)(req.query.AgentCommission, inputValidation_1.validateFloat);
    const limit = (0, inputValidation_1.validateOptional)(req.query.limit, inputValidation_1.validateInteger);
    const skip = (0, inputValidation_1.validateOptional)(req.query.skip, inputValidation_1.validateInteger);
    return {
        InvoiceAmount: (invoiceAmount) ? invoiceAmount : null,
        InvoiceDeductible: (invoiceDeductible) ? invoiceDeductible : null,
        AgentFirstName: (agentFirstName) ? agentFirstName : null,
        AgentLastName: (agentLastName) ? agentLastName : null,
        DatePaid: (datePaid) ? datePaid : null,
        AgentCommission: (agentCommission) ? agentCommission : null,
        limit: (limit) ? limit : null,
        skip: (skip) ? skip : null,
    };
};
exports.default = { all, id, create, update, remove, filter };
