import { QueryResult, ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import Expense, { ExpenseRow } from "../models/expenses";
import { queryBuilder, QueryValuePair } from "../utils/dbUtils";
import { LIMIT_MAX } from "../config/limiterConfig";

const EXPENSES_TABLE_NAME = "expenses";

export const ExpensesRepository = {
    retrieveAll(limit: number = LIMIT_MAX, offset?: number): Promise<Expense[]> {
        let qv = queryBuilder.select(EXPENSES_TABLE_NAME);
        queryBuilder.limit(qv, limit);
        queryBuilder.skip(qv, offset);

        return new Promise((resolve, reject) => {
            connection.execute<Expense[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });
    },

    retrieveById(id: number): Promise<Expense | undefined> {
        let qv = queryBuilder.select(EXPENSES_TABLE_NAME);
        queryBuilder.where(qv, { Id: id });

        return new Promise((resolve, reject) => {
            connection.execute<Expense[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res[0]);
                }
            );
        });
    },

    async insert(expense: ExpenseRow): Promise<number> {
        let qv = queryBuilder.insert(EXPENSES_TABLE_NAME, {
            InvoiceAmount: expense.InvoiceAmount,
            InvoiceDeductible: expense.InvoiceDeductible,
            AgentFirstName: expense.AgentFirstName,
            AgentLastName: expense.AgentLastName,
            DatePaid: expense.DatePaid,
            AgentCommission: expense.AgentCommission,
        });

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res.insertId);
                }
            );
        });
    },

    async update(id: number, expense: ExpenseRow): Promise<void> {
        let qv = queryBuilder.update(EXPENSES_TABLE_NAME, {
            InvoiceAmount: expense.InvoiceAmount,
            InvoiceDeductible: expense.InvoiceDeductible,
            AgentFirstName: expense.AgentFirstName,
            AgentLastName: expense.AgentLastName,
            DatePaid: expense.DatePaid,
            AgentCommission: expense.AgentCommission,
        });
        queryBuilder.where(qv, { Id: id });

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    },

    delete(id: number): Promise<void> {
        let qv = queryBuilder.delete(EXPENSES_TABLE_NAME);
        queryBuilder.where(qv, { Id: id });

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    },
};
