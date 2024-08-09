import express = require('express');
import Expense, { ExpenseRow } from '../models/expenses';
import { ExpenseQuery, ExpensesRepository } from '../repository/expenses';
import logger from '../utils/logger';
import { LogLevel } from '../config/logConfig';
import { validateRequired, validateInteger, validateDate, validateOptional, validateFloat, validateName } from '../middleware/inputValidation';
import { makeExpenseView, makeExpenseArrayView } from '../projections/expenses';

const all = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        ExpensesRepository.retrieveAll()
            .then(async (result) => {
                const data =  await makeExpenseArrayView(result);
                res.json({
                    data: data,
                    count : result.length 
                });
                logger.log(LogLevel.AUDIT, `Retrieved all expenses`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error retrieving all expenses: ${err.message}`);
                next(err);
            });
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error retrieving all expenses: ${err.message}`);
        next(err);
    }
};

const id = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let id = validateRequired(req.query.id.toString(), validateInteger);
        ExpensesRepository.retrieveById(id)
            .then(async (result) => {
                if (result.length == 0) {
                    logger.log(LogLevel.DEBUG, `Expense not found: ${id}`);
                    res.status(404).end();
                    return;
                }
                res.json(await makeExpenseView(result));
                logger.log(LogLevel.AUDIT, `Expense retrieved: ${id}`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error retrieving expense by id: ${err.message}`);
                next(err);
            });
    } catch (error) {
        logger.log(LogLevel.ERRORS, `Error retrieving expense by id: ${error.message}`);
        next(error);
    }
};

const create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const expense: ExpenseRow = {
            InvoiceAmount: validateRequired(req.body.InvoiceAmount, validateFloat),
            InvoiceDeductible: validateRequired(req.body.InvoiceDeductible, validateFloat),
            AgentFirstName: validateRequired(req.body.AgentFirstName, validateName),
            AgentLastName: validateRequired(req.body.AgentLastName, validateName),
            DatePaid: validateRequired(req.body.DatePaid, validateDate),
            AgentCommission: validateRequired(req.body.AgentCommission, validateFloat),
        };

        ExpensesRepository.insert(expense)
            .then(async (result) => {
                if (result = undefined) {
                    throw new Error(`Failed to create order with params ${expense}`)
                }
                res.json(await makeExpenseView({...expense, Id: result}));
                logger.log(LogLevel.AUDIT, `Expense created: ${result}`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error creating expense: ${err.message}`);
                next(err);
            });
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error creating expense: ${err.message}`);
        next(err);
    }
};

const update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const expense: ExpenseRow = {
            InvoiceAmount: validateRequired(req.body.InvoiceAmount, validateFloat),
            InvoiceDeductible: validateRequired(req.body.InvoiceDeductible, validateFloat),
            AgentFirstName: validateRequired(req.body.AgentFirstName, validateName),
            AgentLastName: validateRequired(req.body.AgentLastName, validateName),
            DatePaid: validateRequired(req.body.DatePaid, validateDate),
            AgentCommission: validateRequired(req.body.AgentCommission, validateFloat),
        };

        let id = validateRequired(req.query.id.toString(), validateInteger);

        ExpensesRepository.update(id, expense)
            .then(async (result) => {
                if (result == undefined){
                    throw new Error(`Failed to update expense with id ${id}`)
                }
                res.json(await makeExpenseView({...expense, Id: result}));
                logger.log(LogLevel.AUDIT, `Expense updated: ${result}`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error updating expense: ${err.message}`);
                next(err)
            });
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error updating expense: ${err.message}`);
        next(err);
    }
};

const remove = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let id = validateRequired(req.query.id.toString(), validateInteger);

        ExpensesRepository.delete(id)
            .then((result) => {
                if (result == undefined){
                    throw new Error(`Failed to delete expense with id ${id}`);
                }
                logger.log(LogLevel.AUDIT, `Expense deleted: ${id}`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error deleting expense with id ${id}: ${err.message}`);
                next(err);
            });
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error deleting expense with id ${id}: ${err.message}`);
        next(err);
    }
};

const filter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const query = makeQuery(req);
        ExpensesRepository.filter(query)
            .then(async (result) => {
                res.json({
                    data: await makeExpenseArrayView(result),
                    count : result.length 
                });
                logger.log(LogLevel.AUDIT, `Filtered expenses`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error filtering expenses: ${err.message}`);
                next(err);
            });
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error filtering expenses: ${err.message}`);
        next(err);
    }
};

const makeQuery = (req: express.Request): ExpenseQuery => {
    const invoiceAmount = validateOptional(req.query.InvoiceAmount, validateFloat);
    const invoiceDeductible = validateOptional(req.query.InvoiceDeductible, validateFloat);
    const agentFirstName = validateOptional(req.query.AgentFirstName, validateName);
    const agentLastName = validateOptional(req.query.AgentLastName, validateName);
    const datePaid = validateOptional(req.query.DatePaid, validateDate);
    const agentCommission = validateOptional(req.query.AgentCommission, validateFloat);
    const limit = validateOptional(req.query.limit, validateInteger);
    const skip = validateOptional(req.query.skip, validateInteger);

    return {
        InvoiceAmount: (invoiceAmount) ? (invoiceAmount as number) : null,
        InvoiceDeductible: (invoiceDeductible) ? (invoiceDeductible as number) : null,
        AgentFirstName: (agentFirstName) ? (agentFirstName as string) : null,
        AgentLastName: (agentLastName) ? (agentLastName as string) : null,
        DatePaid: (datePaid) ? (datePaid as string) : null,
        AgentCommission: (agentCommission) ? (agentCommission as number) : null,
        limit: (limit) ? (limit as number) : null,
        skip: (skip) ? (skip as number) : null,
    };
}

export default { all, id, create, update, remove, filter };
