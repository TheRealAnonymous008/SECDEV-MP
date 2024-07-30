import { QueryResult, ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import Customer, { CustomerRow } from "../models/customer";
import { LIMIT_MAX } from "../config/limiterConfig";
import { queryBuilder, QueryValuePair } from "../utils/dbUtils";

const tableName = "customer"

export const CustomerRepository = {
    retrieveAll(limit : number = LIMIT_MAX, offset? : number) : Promise<Customer[]> {
        let qv = queryBuilder.select(tableName)
        queryBuilder.limit(qv, limit),
        queryBuilder.skip(qv, offset)

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
    },

    retrieveById(id :  number) : Promise<Customer | undefined> {
        let qv = queryBuilder.select(tableName)
        queryBuilder.where(qv, {"Id": id})

        return new Promise((resolve, reject) => {
            connection.execute<Customer[]>(
                qv.query,
                qv.values,
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
        let qv = queryBuilder.insert(tableName, {
            "FirstName" : object.FirstName,
            "LastName" : object.LastName,
            "MobileNumber" : object.MobileNumber,
            "Email": object.Email,
            "Company": object.Company,
            "Insurance": object.Insurance,
            "Remarks": object.Remarks,
        })

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
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
        let qv = queryBuilder.update(tableName, {
            "FirstName" : object.FirstName,
            "LastName" : object.LastName,
            "MobileNumber" : object.MobileNumber,
            "Email": object.Email,
            "Company": object.Company,
            "Insurance": object.Insurance,
            "Remarks": object.Remarks,
        })
        queryBuilder.where(qv, {"Id" : id})

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
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
        
        let qv = queryBuilder.delete(tableName)
        queryBuilder.where(qv, {"id" : id})
        
        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values,
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
        let qv = queryBuilder.count(tableName)
        
        return new Promise((resolve, reject) => {
            connection.execute<QueryResult>(
                qv.query,
                qv.values,
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

export const makeSQLQuery = (query: CustomerQuery): QueryValuePair => {
    let qv = queryBuilder.select(tableName)
    queryBuilder.filter(qv, {
        "CONCAT(FirstName, LastName)" : query.name,
        "Email": query.email,
        "MobileNumber" : query.mobileNumber,
        "Company" : query.company,
        "Remarks": query.remarks
    })
    queryBuilder.limit(qv, query.limit)
    queryBuilder.skip(qv, query.skip)

    return qv;
}