import { QueryResult, ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import Customer, { CustomerRow } from "../models/customer";
import IRepository from "./IRepository";
import { buildMatchString } from "../utils/match";


export const CustomerRepository : IRepository<Customer> = {
    retrieveAll(limit? : number, offset? : number) : Promise<Customer[]> {
        let query = "SELECT * FROM customer";
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
            connection.execute<Customer[]>(
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

    retrieveById(id :  number) : Promise<Customer | undefined> {
        let query = `SELECT * FROM customer WHERE Id = ?`

        return new Promise((resolve, reject) => {
            connection.execute<Customer[]>(
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

    insert(object : CustomerRow ) : Promise<number> {
        let values = [
            object.FirstName,
            object.LastName,
            object.MobileNumber,
            object.Email,
            object.Company,
            object.Insurance,
            object.Remarks
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
        let query =`DELETE FROM customer WHERE id = ?`
        
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
    },

    filter(query : CustomerQuery) : Promise<Customer[]> {
        let qv = makeSQLQuery(query)

        return new Promise((resolve, reject) => {
            connection.execute<Customer[]>(
                qv.query,
                qv.values,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res)
                    }
                }
            )
        })
    }
}


export interface CustomerQuery {
    name : string,
    email: string,
    mobileNumber: string,
    company: string,
    insurance: string,
    remarks: string,
    limit : number, 
    skip : number,
}

export const makeSQLQuery = (query: CustomerQuery): { query: string, values: any[] } => {
    let q = `SELECT * FROM customer`;
    let whereClauses: string[] = [];
    let values: any[] = [];

    if (query.name) {
        whereClauses.push(`CONCAT(FirstName, LastName) LIKE ?`);
        values.push(buildMatchString(query.name));
    }
    if (query.email) {
        whereClauses.push(`Email LIKE ?`);
        values.push(buildMatchString(query.email));
    }
    if (query.mobileNumber) {
        whereClauses.push(`MobileNumber LIKE ?`);
        values.push(buildMatchString(query.mobileNumber));
    }
    if (query.company) {
        whereClauses.push(`Company LIKE ?`);
        values.push(buildMatchString(query.company));
    }
    if (query.insurance) {
        whereClauses.push(`Insurance LIKE ?`);
        values.push(buildMatchString(query.insurance));
    }
    if (query.remarks) {
        whereClauses.push(`Remarks LIKE ?`);
        values.push(buildMatchString(query.remarks));
    }

    if (whereClauses.length > 0) {
        q += " WHERE " + whereClauses.join(" AND ");
    }

    if (query.limit) {
        q += ` LIMIT ?`;
        values.push(query.limit);
    }
    if (query.skip) {
        q += ` OFFSET ?`;
        values.push(query.skip);
    }

    return { query: q, values: values };
}