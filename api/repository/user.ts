import { UserRow } from "../models/user";
import { ResultSetHeader } from "mysql2";
import connection from "../config/connection";

export const UserRepository = {
    register (user : UserRow) : Promise<number> {
        let values = [
            user.firstName,
            user.lastName,
            user.username,
            user.password,
            user.salt,
            user.role,
            user.email,
            user.mobileNumber
        ]

        let query ="INSERT INTO users(FirstName, LastName, Username, Password, Salt ,Role, Email, MobileNumber) \
        VALUES(?, ?, ?, ?, ?, ?, ?, ?);"
        
        console.log(query)
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
}