import { ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import Customer from "../models/customer";

interface IRepositiory<T> {
    retrieveAll: (limit? : number, offset? : number) => Promise<T[]>;
    // retieveById(id :  number) : Promise<T | undefined>,
    // insert(object : T) : Promise<T>,
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
            connection.query<Customer[]>(
                query,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(res)
                    }
                }
            )
        })
    }

    // retieveById(id :  number) : Promise<Customer | undefined> {
        
    // }
    // insert(object : Customer) : Promise<Customer> {

    // }
    // update(id : number, object : Customer) : Promise<number> {

    // }
    // delete(id : number) : Promise<number> {

    // }
}
