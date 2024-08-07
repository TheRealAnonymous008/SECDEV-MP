import express = require('express');
import Expense, { ExpenseRow } from '../models/expenses';
import { ExpensesRepository } from '../repository/expenses';
import logger from '../utils/logger';
import { LogLevel } from '../config/logConfig';
import { validateRequired, validateInteger, validateDate } from '../middleware/inputValidation';
import { makeExpenseView, makeExpenseArrayView } from '../projections/expenses';

const all = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        ExpensesRepository.retrieveAll()
            .then(async (result) => {
                const data =  await makeExpenseArrayView(result).catch((err) => {next(err)});
                res.json({
                    data: data,
                    count : result.length 
                });
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
                    res.status(404).end();
                    return;
                }
                res.json(await makeExpenseView(result));
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
            InvoiceAmount: parseFloat(req.body.InvoiceAmount),
            InvoiceDeductible: parseFloat(req.body.InvoiceDeductible),
            AgentFirstName: req.body.AgentFirstName,
            AgentLastName: req.body.AgentLastName,
            DatePaid: req.body.DatePaid,
            AgentCommission: parseFloat(req.body.AgentCommission),
        };

        ExpensesRepository.insert(expense)
            .then(async (result) => {
                if (result = undefined) {
                    throw new Error(`Failed to create order with params ${expense}`)
                }
                
                res.json(await makeExpenseView({...expense, Id: result}));
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
            InvoiceAmount: parseFloat(req.body.InvoiceAmount),
            InvoiceDeductible: parseFloat(req.body.InvoiceDeductible),
            AgentFirstName: req.body.AgentFirstName,
            AgentLastName: req.body.AgentLastName,
            DatePaid: req.body.DatePaid,
            AgentCommission: parseFloat(req.body.AgentCommission),
        };

        let id = validateRequired(req.query.id.toString(), validateInteger);

        ExpensesRepository.update(id, expense)
            .then(async (result) => {
                if (result == undefined){
                    throw new Error(`Failed to update expense with id ${id}`)
                }
                res.json(await makeExpenseView({...expense, Id: result}));
                res.status(200).end();
            })
            .catch((err) => {
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

export default { all, id, create, update, remove };
