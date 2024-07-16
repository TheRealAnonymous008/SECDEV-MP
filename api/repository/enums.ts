import { QueryResult, ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import IRepository from "./IRepository";
import { LIMIT_MAX } from "../config/limiterConfig";
import { queryBuilder, QueryValuePair } from "../utils/dbUtils";
import { IEnum } from "../models/enums";

interface EnumRepository {
    tableName: string;

    retrieveAll(limit?: number, offset?: number): Promise<IEnum[]>;

    retrieveByName(name: string): Promise<IEnum | undefined>;
}

const createEnumRepository = (tableName: string): EnumRepository => {
    return {
        tableName,

        async retrieveAll(limit: number = LIMIT_MAX, offset?: number): Promise<IEnum[]> {
            let qv = queryBuilder.select(this.tableName);
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

        async retrieveByName(name: string): Promise<IEnum | undefined> {
            let qv = queryBuilder.select(this.tableName);
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
};

export const RoleEnumRepository = createEnumRepository("RoleEnum");
export const StatusEnumRepository = createEnumRepository("StatusEnum");
export const TypeEnumRepository = createEnumRepository("TypeEnum");
