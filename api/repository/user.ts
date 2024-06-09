import User, { UserRow } from "../models/user";
import { ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import IRepository from "./IRepository";
import { Multer } from "multer";

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

    verifyRole(username : string, role : string ) : Promise<boolean> {
        let query = `SELECT * FROM users JOIN roleenum ON users.Role = roleenum.Id WHERE Username = "${username}" AND Name = "${role.toUpperCase()}"`;
        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader[]>(
                query, 
                (err, res) => {
                    if (err) reject(err);
                    else {
                        resolve(res.length > 0)
                    }
                }
            )
        })
    },

    retrieveByUsername(username : string) : Promise<User | undefined> {
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

    retrieveAll(limit? : number, offset? : number) : Promise<User[]> {
        let query = `SELECT u.Id, u.FirstName, u.LastName, u.Username, e.Name as "Role", u.MobileNumber, u.Email FROM users u INNER JOIN roleenum e ON u.Role = e.Id;`;
        if (limit){
            query += ` LIMIT ${limit}`
        }
        if (offset){
            query += ` OFFST ${offset}`
        }

        return new Promise((resolve, reject) => {
            connection.execute<User[]>(
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

    retrieveById(id :  number) : Promise<User | undefined> {
        let query =  `SELECT u.Id, u.FirstName, u.LastName, u.Username, e.Name as "Role", u.MobileNumber, u.Email FROM users u INNER JOIN roleenum e ON u.Role = e.Id; WHERE u.Id = ${id}`

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
    
    upload(id : number, image : Express.Multer.File) : Promise<number>{
        let query = `INSERT INTO picture(Picture) VALUES(?)`

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                query,
                [image],
                (err, res) => {
                    if (err) reject(err);
                    else{
                        const fk = res.insertId;
                        let q2 = `UPDATE users SET PictureId =${fk} WHERE Id = ${id}`
                        connection.execute<ResultSetHeader>(
                            q2,
                            (err, res) => {
                                if(err) reject(err);
                                resolve(fk)
                            }
                        )
                    }
                }
            )
        })
    },

    update(id : number, object : UserRow) : Promise<number> {
        let values = [
            object.FirstName,
            object.LastName,
            object.Username,
            object.Role,
            object.Email,
            object.MobileNumber,
            id
        ]

        let query ="UPDATE users SET FirstName = ?, LastName = ?, Username = ?, Role = ?, Email = ?, MobileNubmer = ? WHERE Id=?"
        
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
        let query =`DELETE FROM users WHERE id = ${id}`
        
        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                query,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(id)
                    }
                }
            )
        })
    }
}