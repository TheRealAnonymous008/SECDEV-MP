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

    async update(id: number, expense: ExpenseRow): Promise<number> {
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
                    else resolve(id);
                }
            );
        });
    },

    delete(id: number): Promise<number> {
        let qv = queryBuilder.delete(EXPENSES_TABLE_NAME);
        queryBuilder.where(qv, { Id: id });

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(id);
                }
            );
        });
    },

    filter(query: ExpenseQuery): Promise<Expense[]> {
        let qv = makeSQLQuery(query);
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
};

export interface ExpenseQuery {
    InvoiceAmount: number;
    InvoiceDeductible: number;
    AgentFirstName: string;
    AgentLastName: string;
    DatePaid: string;
    AgentCommission: number;
    limit: number;
    skip: number;
}

export const makeSQLQuery = (query: ExpenseQuery): QueryValuePair => {
    let qv = queryBuilder.select(EXPENSES_TABLE_NAME);
    queryBuilder.filter(qv, {
        InvoiceAmount: query.InvoiceAmount,
        InvoiceDeductible: query.InvoiceDeductible,
        AgentFirstName: query.AgentFirstName,
        AgentLastName: query.AgentLastName,
        DatePaid: query.DatePaid,
        AgentCommission: query.AgentCommission
    })
    queryBuilder.limit(qv, query.limit);
    queryBuilder.skip(qv, query.skip);
    return qv;
};
