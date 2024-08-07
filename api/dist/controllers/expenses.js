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
const all = (req, res, next) => {
    try {
        expenses_1.ExpensesRepository.retrieveAll()
            .then((result) => {
            res.json({
                data: (0, expenses_2.makeExpenseArrayView)(result),
                count: result.length
            });
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving all expenses: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving all expenses: ${err.message}`);
        next(err);
    }
};
const id = (req, res, next) => {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        expenses_1.ExpensesRepository.retrieveById(id)
            .then((result) => {
            if (result.length == 0) {
                res.status(404).end();
                return;
            }
            res.json((0, expenses_2.makeExpenseView)(result));
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving expense by id: ${err.message}`);
            next(err);
        });
    }
    catch (error) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving expense by id: ${error.message}`);
        next(error);
    }
};
const create = (req, res, next) => {
    try {
        const expense = {
            InvoiceAmount: parseFloat(req.body.InvoiceAmount),
            InvoiceDeductible: parseFloat(req.body.InvoiceDeductible),
            AgentFirstName: req.body.AgentFirstName,
            AgentLastName: req.body.AgentLastName,
            DatePaid: req.body.DatePaid,
            AgentCommission: parseFloat(req.body.AgentCommission),
        };
        console.log(expense);
        const result = expenses_1.ExpensesRepository.insert(expense);
        res.json({ id: result });
        res.status(200).end();
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error creating expense: ${err.message}`);
        next(err);
    }
};
const update = (req, res, next) => {
    try {
        const expense = {
            InvoiceAmount: parseFloat(req.body.InvoiceAmount),
            InvoiceDeductible: parseFloat(req.body.InvoiceDeductible),
            AgentFirstName: req.body.AgentFirstName,
            AgentLastName: req.body.AgentLastName,
            DatePaid: req.body.DatePaid,
            AgentCommission: parseFloat(req.body.AgentCommission),
        };
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        expenses_1.ExpensesRepository.update(id, expense)
            .then((result) => {
            if (result == undefined) {
                throw new Error(`Failed to update expense with id ${id}`);
            }
            res.json((0, expenses_2.makeExpenseView)(Object.assign(Object.assign({}, expense), { Id: result })));
            res.status(200).end();
        })
            .catch((err) => {
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error updating expense: ${err.message}`);
        next(err);
    }
};
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        expenses_1.ExpensesRepository.delete(id)
            .then((result) => {
            console.log(result);
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
// const filter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     try {
//         const expenses = await ExpensesRepository.filter(query);
//         res.json({ data: expenses, count: expenses.length });
//         res.status(200).end();
//     } catch (err) {
//         logger.log(LogLevel.ERRORS, `Error filtering expenses: ${err.message}`);
//         next(err);
//     }
// };
exports.default = { all, id, create, update, remove };
