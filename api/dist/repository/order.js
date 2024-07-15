"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRespository = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const limiterConfig_1 = require("../config/limiterConfig");
const dbUtils_1 = require("../utils/dbUtils");
const ORDER_TABLE_NAME = "order";
exports.OrderRespository = {
    retrieveAll(limit = limiterConfig_1.LIMIT_MAX, offset) {
        let qv = dbUtils_1.queryBuilder.select(ORDER_TABLE_NAME);
        dbUtils_1.queryBuilder.limit(qv, limit);
        dbUtils_1.queryBuilder.skip(qv, offset);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res);
                }
            });
        });
    },
    retrieveById(id) {
        let qv = dbUtils_1.queryBuilder.select(ORDER_TABLE_NAME);
        dbUtils_1.queryBuilder.where(qv, { Id: id });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res[0]);
                }
            });
        });
    },
    insert(object) {
        let qv = dbUtils_1.queryBuilder.insert(ORDER_TABLE_NAME, {
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
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res.insertId);
                }
            });
        });
    },
    update(id, object) {
        let qv = dbUtils_1.queryBuilder.update(ORDER_TABLE_NAME, {
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
        dbUtils_1.queryBuilder.where(qv, { Id: id });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(id);
                }
            });
        });
    },
    delete(id) {
        let qv = dbUtils_1.queryBuilder.delete(ORDER_TABLE_NAME);
        dbUtils_1.queryBuilder.where(qv, { Id: id });
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(id);
                }
            });
        });
    },
    count() {
        let qv = dbUtils_1.queryBuilder.count(ORDER_TABLE_NAME);
        return new Promise((resolve, reject) => {
            connection_1.default.execute(qv.query, qv.values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res[0]['COUNT(*)']);
                }
            });
        });
    },
    filter(query) {
        // Placeholder for filter implementation
        let values = [];
        return new Promise((resolve, reject) => {
            connection_1.default.execute(query, values, (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(res);
                }
            });
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
