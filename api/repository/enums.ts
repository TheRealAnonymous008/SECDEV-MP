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

    retrieveById(name : string) : Promise<IEnum | undefined>;
}

const createEnumRepository = (tableName: string): EnumRepository => {
    return {
        tableName,

        async retrieveAll(limit: number = LIMIT_MAX, offset?: number): Promise<IEnum[]> {
            let qv = queryBuilder.select(this.tableName);
            queryBuilder.limit(qv, limit);
            queryBuilder.skip(qv, offset);

            try {
                const res = await new Promise<IEnum[]>((resolve, reject) => {
                    connection.execute<IEnum[]>(
                        qv.query,
                        qv.values,
                        (err, results) => {
                            if (err) reject(err);
                            else resolve(results);
                        }
                    );
                });
                return res;
            } catch (error) {
                console.error(`Error retrieving all from ${this.tableName}:`, error);
                throw error;
            }
        },

        async retrieveByName(name: string): Promise<IEnum | undefined> {
            let qv = queryBuilder.select(this.tableName);
            queryBuilder.where(qv, { "Name": name });
        
            try {
                const res = await new Promise<IEnum[]>((resolve, reject) => {
                    connection.execute<IEnum[]>(
                        qv.query,
                        qv.values,
                        (err, results) => {
                            if (err) reject(err);
                            else resolve(results);
                        }
                    );
                });
                return res.length > 0 ? res[0] : undefined;
            } catch (error) {
                console.error(`Error retrieving ${name} from ${this.tableName}:`, error);
                throw error;
            }
        },

        async retrieveById(id: string): Promise<IEnum | undefined> {
            let qv = queryBuilder.select(this.tableName);
            queryBuilder.where(qv, { "id": id });
        
            try {
                const res = await new Promise<IEnum[]>((resolve, reject) => {
                    connection.execute<IEnum[]>(
                        qv.query,
                        qv.values,
                        (err, results) => {
                            if (err) reject(err);
                            else resolve(results);
                        }
                    );
                });
                return res.length > 0 ? res[0] : undefined;
            } catch (error) {
                console.error(`Error retrieving ${id} from ${this.tableName}:`, error);
                throw error;
            }
        },
    };
};

export const RoleEnumRepository = createEnumRepository("RoleEnum");
export const StatusEnumRepository = createEnumRepository("StatusEnum");
export const TypeEnumRepository = createEnumRepository("TypeEnum");
