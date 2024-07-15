import { QueryResult, ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import IRepository from "./IRepository";
import { LIMIT_MAX } from "../config/limiterConfig";
import { queryBuilder, QueryValuePair } from "../utils/dbUtils";
import { IRoleEnum, IStatusEnum, ITypeEnum } from '../models/enums';

export const RoleEnumRepository = {
    retrieveAll(limit: number = LIMIT_MAX, offset?: number): Promise<IRoleEnum[]> {
        let qv = queryBuilder.select("autoworks.RoleEnum");
        queryBuilder.limit(qv, limit);
        queryBuilder.skip(qv, offset);

        return new Promise((resolve, reject) => {
            connection.execute<IRoleEnum[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });
    },

    retrieveById(id: number): Promise<IRoleEnum | undefined> {
        let qv = queryBuilder.select("autoworks.RoleEnum")
        queryBuilder.where(qv, { "Id": id });

        return new Promise((resolve, reject) => {
            connection.execute<IRoleEnum[]>(
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
    retrieveAll(limit: number = LIMIT_MAX, offset?: number): Promise<IStatusEnum[]> {
        let qv = queryBuilder.select("autoworks.StatusEnum");
        queryBuilder.limit(qv, limit);
        queryBuilder.skip(qv, offset);

        return new Promise((resolve, reject) => {
            connection.execute<IStatusEnum[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });
    },

    retrieveById(id: number): Promise<IStatusEnum | undefined> {
        let qv = queryBuilder.select("autoworks.StatusEnum")
        queryBuilder.where(qv, { "Id": id });

        return new Promise((resolve, reject) => {
            connection.execute<IStatusEnum[]>(
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
    retrieveAll(limit: number = LIMIT_MAX, offset?: number): Promise<ITypeEnum[]> {
        let qv = queryBuilder.select("autoworks.TypeEnum");
        queryBuilder.limit(qv, limit);
        queryBuilder.skip(qv, offset);

        return new Promise((resolve, reject) => {
            connection.execute<ITypeEnum[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });
    },

    retrieveById(id: number): Promise<ITypeEnum | undefined> {
        let qv = queryBuilder.select("autoworks.TypeEnum")
        queryBuilder.where(qv, { "Id": id });

        return new Promise((resolve, reject) => {
            connection.execute<ITypeEnum[]>(
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
