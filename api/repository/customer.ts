import { ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import Customer, { CustomerRow } from "../models/customer";

interface IRepositiory<T> {
    retrieveAll: (limit? : number, offset? : number) => Promise<T[]>;
    retieveById : (id :  number) => Promise<T | undefined>;
    insert : (object) => Promise<number>;
    // update(id : number, object : T) : Promise<number>, 
    // delete(id : number) : Promise<number>  
};

export const CustomerRepository : IRepositiory<Customer> = {
    retrieveAll(limit? : number, offset? : number) : Promise<Customer[]> {
        let query = "SELECT * FROM customer";
        if (limit){
            query += ` LIMIT ${limit}`
        }
        if (offset){
            query += ` OFFST ${offset}`
        }

        return new Promise((resolve, reject) => {
            connection.execute<Customer[]>(
                query,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res)
                    }
                }
            )
        })
    },

    retieveById(id :  number) : Promise<Customer | undefined> {
        let query = `SELECT * FROM customer WHERE Id = ${id}`

        return new Promise((resolve, reject) => {
            connection.execute<Customer[]>(
                query,
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
            object.firstName,
            object.lastName,
            object.mobileNumber,
            object.email,
            object.company,
            object.insurance,
            object.remarks
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
    }
    // update(id : number, object : Customer) : Promise<number> {

    // }
    // delete(id : number) : Promise<number> {

    // }
}
