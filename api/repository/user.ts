import User, { SessionEntry, UserRow } from "../models/user";
import { QueryResult, ResultSetHeader } from "mysql2";
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

    addSession(id : number, sessionId : string) : Promise<boolean>{
        let query = `INSERT INTO sessions(SessionId, UserId) VALUES (?, ?)`;
        
        return new Promise((resolve, reject) => { 
            connection.execute<ResultSetHeader>(
                query,
                [sessionId, id], 
                (err, res) => {
                    if (err) reject(err); 
                    else { 
                        resolve(true);
                    }
                }
            )
        })
    },

    getUserFromSession(sessionId : string) : Promise<User | undefined> {
        let query = `SELECT UserId FROM sessions WHERE SessionId = ?`;

        return new Promise((resolve, reject) => {
            connection.execute<SessionEntry[]>(
                query, 
                [sessionId],
                async (err, res) => {
                    if (err) reject(err);
                    else {
                        if (res.length == 0)
                            resolve(undefined)
                        else {
                            const x = await UserRepository.retrieveById(res[0].UserId);
                            resolve(x);
                        }
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
                        if(res.length == 0)
                            resolve(undefined)
                        else 
                            resolve(res[0])
                    }
                }
            )
        })
    },

    retrieveAll(limit? : number, offset? : number) : Promise<User[]> {
        let query = `SELECT u.Id, u.FirstName, u.LastName, u.Username, e.Name as "Role", u.MobileNumber, u.Email FROM users u INNER JOIN roleenum e ON u.Role = e.Id`;
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
        let query =  `SELECT u.Id, u.FirstName, u.LastName, u.Username, e.Name as "Role", u.MobileNumber, u.Email FROM users u INNER JOIN roleenum e ON u.Role = e.Id WHERE u.Id = ${id}`

        return new Promise((resolve, reject) => {
            connection.execute<User[]>(
                query,
                (err, res) => {
                    if (err) reject(err);
                    else{
                        if (res.length == 0)
                            resolve(undefined)
                        else 
                            resolve(res[0])
                    }
                }
            )
        })
    },
    
    // The provided id is the session ID so first we must obtain the actual user ID
    async upload(sessid : string, image : Express.Multer.File) : Promise<number>{
        let user = await  UserRepository.getUserFromSession(sessid)
        const id = user.Id;
        let query = `INSERT INTO picture(Picture) VALUES(?)`

        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                query,
                [image],
                (err, res) => {
                    if (err) reject(err);
                    else{
                        const fk = res.insertId;
                        // Cleanup a bit by removing the old BLOB if the user had this 
                        query = `SELECT PictureId from users WHERE Id = ${id}`
                        connection.execute<User[]>(
                            query, 
                            (err, res) => {
                                if (err) reject(err);
                                if (res.length > 0) {
                                    query = `DELETE FROM picture WHERE Id = ${res[0].PictureId}`
                                    connection.execute<ResultSetHeader>(
                                        query, 
                                        (err, res) => {
                                            if (err) reject(err);
                                        }
                                    )
                                }
                            }
                        )

                        query = `UPDATE users SET PictureId =${fk} WHERE Id = ${id}`
                        connection.execute<ResultSetHeader>(
                            query,
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
        let query =`DELETE FROM sessions WHERE UserId = ?; DELETE FROM users WHERE id = ?; `
        
        return new Promise((resolve, reject) => {
            connection.execute<ResultSetHeader>(
                query,
                [id, id],
                (err, res) => {
                    if (err) reject(err);
                    else{
                        resolve(id)
                    }
                }
            )
        })
    },

    deleteSession(id : string) : Promise<number> {
        let query = `DELETE FROM sessions WHERE SessionId = ?`
            return new Promise((resolve, reject) => {
                connection.execute<ResultSetHeader>(
                    query,
                    [id],
                    (err, res) => {
                        if (err) reject(err);
                        else{
                            resolve(1)
                        }
                    }
                )
            })
        }
}