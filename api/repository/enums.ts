import { QueryResult, ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import IRepository from "./IRepository";
import { LIMIT_MAX } from "../config/limiterConfig";
import { queryBuilder, QueryValuePair } from "../utils/dbUtils";
import { IEnum } from "../models/enums";

export const RoleEnumRepository = {
    retrieveAll(limit: number = LIMIT_MAX, offset?: number): Promise<IEnum[]> {
        let qv = queryBuilder.select("RoleEnum");
        queryBuilder.limit(qv, limit);
        queryBuilder.skip(qv, offset);

        return new Promise((resolve, reject) => {
            connection.execute<IEnum[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });
    },

    retrieveByName(name: string): Promise<IEnum | undefined> {
        let qv = queryBuilder.select("RoleEnum");
        queryBuilder.where(qv, { "Name": name });
    
        return new Promise((resolve, reject) => {
            connection.execute<IEnum[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res.length > 0 ? res[0] : undefined);
                }
            );
        });
    },
     
};

export const StatusEnumRepository = {
    retrieveAll(limit: number = LIMIT_MAX, offset?: number): Promise<IEnum[]> {
        let qv = queryBuilder.select("StatusEnum");
        queryBuilder.limit(qv, limit);
        queryBuilder.skip(qv, offset);

        return new Promise((resolve, reject) => {
            connection.execute<IEnum[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });
    },

    retrieveByName(name: string): Promise<IEnum | undefined> {
        let qv = queryBuilder.select("StatusEnum");
        queryBuilder.where(qv, { "Name": name });
    
        return new Promise((resolve, reject) => {
            connection.execute<IEnum[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res.length > 0 ? res[0] : undefined);
                }
            );
        });
    },    
};

export const TypeEnumRepository = {
    retrieveAll(limit: number = LIMIT_MAX, offset?: number): Promise<IEnum[]> {
        let qv = queryBuilder.select("TypeEnum");
        queryBuilder.limit(qv, limit);
        queryBuilder.skip(qv, offset);

        return new Promise((resolve, reject) => {
            connection.execute<IEnum[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });
    },

    retrieveByName(name: string): Promise<IEnum | undefined> {
        let qv = queryBuilder.select("TypeEnum");
        queryBuilder.where(qv, { "Name": name });
    
        return new Promise((resolve, reject) => {
            connection.execute<IEnum[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res.length > 0 ? res[0] : undefined);
                }
            );
        });
    },
    
};
