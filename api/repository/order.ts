import { QueryResult, ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import Customer, { CustomerRow } from "../models/customer";
import IRepository from "./IRepository";
import Order, { OrderRow } from "../models/order";
import { LIMIT_MAX } from "../config/limiterConfig";
import { queryBuilder, QueryValuePair } from "../utils/dbUtils";

const ORDER_TABLE_NAME = "order";

export const OrderRespository: IRepository<Order> = {
    retrieveAll(limit: number = LIMIT_MAX, offset?: number): Promise<Order[]> {
        let qv = queryBuilder.select(ORDER_TABLE_NAME);
        queryBuilder.limit(qv, limit);
        queryBuilder.skip(qv, offset);

        return new Promise((resolve, reject) => {
            connection.execute<Order[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else {
                        resolve(res);
                    }
                }
            );
        });
    },

    retrieveById(id: number): Promise<Order | undefined> {
        let qv = queryBuilder.select(ORDER_TABLE_NAME);
        queryBuilder.where(qv, { Id: id });

        return new Promise((resolve, reject) => {
            connection.execute<Order[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else {
                        resolve(res[0]);
                    }
                }
            );
        });
    },

    insert(object: OrderRow): Promise<number> {
        let qv = queryBuilder.insert(ORDER_TABLE_NAME, {
            Status: object.Status,
            TimeIn: object.TimeIn,
            TimeOut: object.TimeOut,
            CustomerId: object.CustomerId,
            TypeId: object.TypeId,
            VehicleId: object.VehicleId,
            EstimateNumber: object.EstimateNumber,
            ScopeOfWork: object.ScopeOfWork,
            IsVerified: object.IsVerified
        });

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else {
                        resolve(res.insertId);
                    }
                }
            );
        });
    },

    update(id: number, object: OrderRow): Promise<number> {
        let qv = queryBuilder.update(ORDER_TABLE_NAME, {
            Status: object.Status,
            TimeIn: object.TimeIn,
            TimeOut: object.TimeOut,
            CustomerId: object.CustomerId,
            TypeId: object.TypeId,
            VehicleId: object.VehicleId,
            EstimateNumber: object.EstimateNumber,
            ScopeOfWork: object.ScopeOfWork,
            IsVerified: object.IsVerified
        });
        queryBuilder.where(qv, { Id: id });

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else {
                        resolve(id);
                    }
                }
            );
        });
    },

    delete(id: number): Promise<number> {
        let qv = queryBuilder.delete(ORDER_TABLE_NAME);
        queryBuilder.where(qv, { Id: id });

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else {
                        resolve(id);
                    }
                }
            );
        });
    },

    count(): Promise<number> {
        let qv = queryBuilder.count(ORDER_TABLE_NAME);

        return new Promise((resolve, reject) => {
            connection.execute<QueryResult>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else {
                        resolve(res[0]['COUNT(*)']);
                    }
                }
            );
        });
    },

    filter(query: any): Promise<Order[]> {
        // Placeholder for filter implementation
        let values = [];
        return new Promise((resolve, reject) => {
            connection.execute<Order[]>(
                query,
                values,
                (err, res) => {
                    if (err) reject(err);
                    else {
                        resolve(res);
                    }
                }
            );
        });
    }
};


// const ORDER_TABLE_NAME = process.env.DB_DATABASE + ".order";

// export const OrderRespository : IRepository<Order> = {
//     retrieveAll(limit : number = LIMIT_MAX , offset? : number) : Promise<Order[]> {
//         let query = `SELECT * FROM ${ORDER_TABLE_NAME}`;
//         let values = []
//         if (limit){
//             query += ` LIMIT ?`
//             values.push(limit)
//         }
//         if (offset){
//             query += ` OFFSET ?`
//             values.push(offset)
//         }

//         return new Promise((resolve, reject) => {
//             connection.execute<Order[]>(
//                 query,
//                 values,
//                 (err, res) => {
//                     if (err) reject(err);
//                     else{
//                         resolve(res)
//                     }
//                 }
//             )
//         })
//     },

//     retrieveById(id :  number) : Promise<Order | undefined> {
//         let query = `SELECT * FROM ${ORDER_TABLE_NAME} WHERE Id = ?`

//         return new Promise((resolve, reject) => {
//             connection.execute<Order[]>(
//                 query,
//                 [id],
//                 (err, res) => {
//                     if (err) reject(err);
//                     else{
//                         resolve(res[0])
//                     }
//                 }
//             )
//         })
//     },

//     insert(object : OrderRow ) : Promise<number> {
//         let values = [
//             object.Status,
//             object.TimeIn,
//             object.TimeOut,
//             object.CustomerId,
//             object.TypeId,
//             object.VehicleId,
//             object.EstimateNumber,
//             object.ScopeOfWork,
//             object.IsVerified
//         ]

//         let query ="INSERT INTO customer(FirstName, LastName, MobileNumber, Email, Company, Insurance, Remarks) \
//         VALUES(?, ?, ?, ?, ?, ?, ?);"
        
//         return new Promise((resolve, reject) => {
//             connection.execute<ResultSetHeader>(
//                 query,
//                 values,
//                 (err, res) => {
//                     if (err) reject(err);
//                     else{
//                         resolve(res.insertId)
//                     }
//                 }
//             )
//         })
//     },

//     update(id : number, object : CustomerRow) : Promise<number> {
//         let values = [
//             object.FirstName,
//             object.LastName,
//             object.MobileNumber,
//             object.Email,
//             object.Company,
//             object.Insurance,
//             object.Remarks,
//             id
//         ]

//         let query ="UPDATE customer SET FirstName = ?, LastName = ?, MobileNumber = ?, Email = ?, Company = ?, Insurance = ?, Remarks = ? WHERE Id=?"
        
//         return new Promise((resolve, reject) => {
//             connection.execute<ResultSetHeader>(
//                 query,
//                 values,
//                 (err, res) => {
//                     if (err) reject(err);
//                     else{
//                         resolve(id)
//                     }
//                 }
//             )
//         })
//     },

//     delete(id : number) : Promise<number> {
//         let query =`DELETE FROM order WHERE id = ?`
        
//         return new Promise((resolve, reject) => {
//             connection.execute<ResultSetHeader>(
//                 query,
//                 [id],
//                 (err, res) => {
//                     if (err) reject(err);
//                     else{
//                         resolve(id)
//                     }
//                 }
//             )
//         })
//     },

//     count() : Promise<number> {
//         let query = "SELECT COUNT(*) FROM vehicle"
        
//         return new Promise((resolve, reject) => {
//             connection.execute<QueryResult>(
//                 query,
//                 (err, res) => {
//                     if (err) reject(err);
//                     else{
//                         resolve(res[0]['COUNT(*)'])
//                     }
//                 }
//             )
//         })
//     },

//     filter(query : any) : Promise<Order[]> {
//         // Placeholder
//         let values = []
//         return new Promise((resolve, reject) => {
//             connection.execute<Order[]>(
//                 query,
//                 values,
//                 (err, res) => {
//                     if (err) reject(err);
//                     else{
//                         resolve(res)
//                     }
//                 }
//             )
//         })
//     }
// }
