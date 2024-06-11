import { QueryResult, ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import Customer, { CustomerRow } from "../models/customer";
import IRepository from "./IRepository";
import Order, { OrderRow } from "../models/order";
import dbConfig from "../config/dbConfig";


const ORDER_TABLE_NAME = dbConfig.database + ".order";

export const OrderRespository : IRepository<Order> = {
    retrieveAll(limit? : number, offset? : number) : Promise<Order[]> {
        let query = `SELECT * FROM ${ORDER_TABLE_NAME}`;
        let values = []
        if (limit){
            query += ` LIMIT ?`
            values.push(limit)
        }
        if (offset){
            query += ` OFFSET ?`
            values.push(offset)
        }

        return new Promise((resolve, reject) => {
            connection.execute<Order[]>(
                query,
                values,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res)
                    }
                }
            )
        })
    },

    retrieveById(id :  number) : Promise<Order | undefined> {
        let query = `SELECT * FROM ${ORDER_TABLE_NAME} WHERE Id = ?`

        return new Promise((resolve, reject) => {
            connection.execute<Order[]>(
                query,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res[0])
                    }
                }
            )
        })
    },

    insert(object : OrderRow ) : Promise<number> {
        let values = [
            object.Status,
            object.TimeIn,
            object.TimeOut,
            object.CustomerId,
            object.TypeId,
            object.VehicleId,
            object.EstimateNumber,
            object.ScopeOfWork,
            object.IsVerified
        ]

        let query ="INSERT INTO customer(FirstName, LastName, MobileNumber, Email, Company, Insurance, Remarks) \
        VALUES(?, ?, ?, ?, ?, ?, ?);"
        
        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                query,
                values,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res.insertId)
                    }
                }
            )
        })
    },

    update(id : number, object : CustomerRow) : Promise<number> {
        let values = [
            object.FirstName,
            object.LastName,
            object.MobileNumber,
            object.Email,
            object.Company,
            object.Insurance,
            object.Remarks,
            id
        ]

        let query ="UPDATE customer SET FirstName = ?, LastName = ?, MobileNumber = ?, Email = ?, Company = ?, Insurance = ?, Remarks = ? WHERE Id=?"
        
        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                query,
                values,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(id)
                    }
                }
            )
        })
    },

    delete(id : number) : Promise<number> {
        let query =`DELETE FROM order WHERE id = ?`
        
        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                query,
                [id],
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(id)
                    }
                }
            )
        })
    },

    count() : Promise<number> {
        let query = "SELECT COUNT(*) FROM vehicle"
        
        return new Promise((resolve, reject) => {
            connection.execute<QueryResult>(
                query,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res[0]['COUNT(*)'])
                    }
                }
            )
        })
    }
}
