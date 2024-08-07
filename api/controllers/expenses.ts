import express = require('express');
import Expense, { ExpenseRow } from '../models/expenses';
import { ExpensesRepository } from '../repository/expenses';
import logger from '../utils/logger';
import { LogLevel } from '../config/logConfig';

const all = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const expenses = await ExpensesRepository.retrieveAll();
        res.json({ data: expenses, count: expenses.length });
        res.status(200).end();
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error retrieving all expenses: ${err.message}`);
        next(err);
    }
};

const id = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const id = parseInt(req.query.id.toString());
        const expense = await ExpensesRepository.retrieveById(id);
        if (!expense) {
            res.status(404).end();
            return;
        }
        res.json(expense);
        res.status(200).end();
    } catch (error) {
        logger.log(LogLevel.ERRORS, `Error retrieving expense by id: ${error.message}`);
        next(error);
    }
};

const create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const expense: ExpenseRow = {
            InvoiceAmount: parseFloat(req.body.invoiceAmount),
            InvoiceDeductible: parseFloat(req.body.invoiceDeductible),
            AgentFirstName: req.body.agentFirstName,
            AgentLastName: req.body.agentLastName,
            DatePaid: req.body.datePaid,
            AgentCommission: parseFloat(req.body.agentCommission),
        };

        const result = await ExpensesRepository.insert(expense);
        res.json({ id: result });
        res.status(200).end();
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error creating expense: ${err.message}`);
        next(err);
    }
};

const update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const expense: Expense = {
            Id: parseInt(req.body.id),
            InvoiceAmount: parseFloat(req.body.invoiceAmount),
            InvoiceDeductible: parseFloat(req.body.invoiceDeductible),
            AgentFirstName: req.body.agentFirstName,
            AgentLastName: req.body.agentLastName,
            DatePaid: req.body.datePaid,
            AgentCommission: parseFloat(req.body.agentCommission),
        } as Expense;

        const result = await ExpensesRepository.insert(expense);
        res.json({ id: result });
        res.status(200).end();
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error updating expense: ${err.message}`);
        next(err);
    }
};

const remove = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const id = parseInt(req.query.id.toString());
        await ExpensesRepository.delete(id);
        res.status(200).end();
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
