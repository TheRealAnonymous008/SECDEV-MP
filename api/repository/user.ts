import User, { UserRow } from "../models/user";
import { ResultSetHeader } from "mysql2";
import connection from "../config/connection";

export const UserRepository = {
    register (user : UserRow) : Promise<number> {
        let values = [
            user.FirstName,
            user.LastName,
            user.Username,
            user.Password,
            user.Salt,
            user.Role,
            user.Email,
            user.MobileNumber
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

    retrieveByUsername(username : string) : Promise<UserRow | undefined> {
        let query = `SELECT * FROM users WHERE Username = "${username}"`

        return new Promise((resolve, reject) => {
            connection.execute<User[]>(
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
}