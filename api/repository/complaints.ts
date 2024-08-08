import { QueryResult, ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import Complaint, { ComplaintRow } from "../models/complaints"; // Adjust the import path as necessary
import { queryBuilder, QueryValuePair } from "../utils/dbUtils";
import { LIMIT_MAX } from "../config/limiterConfig";

const COMPLAINTS_TABLE_NAME = "complaints";

export const ComplaintsRepository = {
    retrieveAll(limit: number = LIMIT_MAX, offset?: number): Promise<Complaint[]> {
        let qv = queryBuilder.select(COMPLAINTS_TABLE_NAME);
        queryBuilder.limit(qv, limit);
        queryBuilder.skip(qv, offset);

        return new Promise((resolve, reject) => {
            connection.execute<Complaint[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });
    },

    retrieveById(id: number): Promise<Complaint | undefined> {
        let qv = queryBuilder.select(COMPLAINTS_TABLE_NAME);
        queryBuilder.where(qv, { Id: id });

        return new Promise((resolve, reject) => {
            connection.execute<Complaint[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res[0]);
                }
            );
        });
    },

    async insert(complaint: ComplaintRow): Promise<number> {
        let qv = queryBuilder.insert(COMPLAINTS_TABLE_NAME, {
            Description: complaint.Description,
            DateReported: complaint.DateReported,
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

    async update(id: number, complaint: ComplaintRow): Promise<number> {
        let qv = queryBuilder.update(COMPLAINTS_TABLE_NAME, {
            Description: complaint.Description,
            DateReported: complaint.DateReported,
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
        let qv = queryBuilder.delete(COMPLAINTS_TABLE_NAME);
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

    filter(query: ComplaintQuery): Promise<Complaint[]> {
        let qv = makeSQLQuery(query);
        return new Promise((resolve, reject) => {
            connection.execute<Complaint[]>(
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

export interface ComplaintQuery {
    Description: string;
    DateReported: string;
    limit: number;
    skip: number;
}

export const makeSQLQuery = (query: ComplaintQuery): QueryValuePair => {
    let qv = queryBuilder.select(COMPLAINTS_TABLE_NAME);
    queryBuilder.filter(qv, {
        Description: query.Description,
        DateReported: query.DateReported
    })
    queryBuilder.limit(qv, query.limit);
    queryBuilder.skip(qv, query.skip);
    return qv;
};
