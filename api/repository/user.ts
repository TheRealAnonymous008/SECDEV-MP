import User, { SessionEntry, UserRow } from "../models/user";
import { ResultSetHeader } from "mysql2";
import connection from "../config/connection";
import { SESSION_EXPIRE_TIME } from "../config/authConfig";
import { LIMIT_MAX } from "../config/limiterConfig";
import { queryBuilder, QueryValuePair } from "../utils/dbUtils";
import { getRandom, getTimestamp, hashId } from "../utils/cryptoUtils";
import { storeFile } from "../utils/fileUtils";


const tableName = "users";
export const UserRepository = {
    register (user : UserRow) : Promise<number> {
        let qv = queryBuilder.insert(tableName, {
            "FirstName": user.FirstName,
            "LastName": user.LastName,
            "Username": user.Username,
            "Password": user.Password,
            "Salt": user.Salt,
            "Role": user.Role,
            "Email": user.Email,
            "MobileNumber": user.MobileNumber
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

    addSession(id : number, sessionId : string, csrf: string) : Promise<boolean>{
        // Make sure to hash the session ID
        sessionId = hashId(sessionId);
        csrf = hashId(csrf)
        const sessionTime = getTimestamp()
        
        let qv = queryBuilder.insert("sessions", {
            "SessionId": sessionId,
            "UserId": id, 
            "SessionTime": sessionTime,
            "Csrf": csrf,
        })
        return new Promise((resolve, reject) => { 
            connection.execute<ResultSetHeader>(
                qv.query,
                qv.values, 
                (err, res) => {
                    if (err) reject(err); 
                    else { 
                        resolve(true);
                    }
                }
            )
        })
    },

    // We include the CSRF validation here. It is as if every request requires us to validate with the csrf token as well
    getUserFromSession(sessionId : string, csrf? : string) : Promise<User | undefined> {
        let qv = queryBuilder.select("sessions", ["UserId"])

        sessionId = hashId(sessionId);

        const currentTime = getTimestamp()
        if (csrf) {
            csrf = hashId(csrf)
            queryBuilder.where(qv, {"SessionId": sessionId, "Csrf" : csrf})
        }
        else {
            queryBuilder.where(qv, {"SessionId": sessionId})
        }

        return new Promise((resolve, reject) => {
            connection.execute<SessionEntry[]>(
                qv.query, 
                qv.values,
                async (err, res) => {
                    if (err) reject(err);
                    else {
                        if (res.length == 0)
                            resolve(undefined)
                        else if (currentTime - parseInt(res[0].SessionTime) > SESSION_EXPIRE_TIME) {
                            resolve(undefined)
                        }
                        else {
                            const x = await UserRepository.retrieveById(res[0].UserId);
                            resolve(x);
                        }
                    }
                }
            )
        })
    },

    // Mechanism for refreshing the CSRF token 
    refreshCSRF(sessionId : string) : Promise<string | undefined>{ 
        let csrf = getRandom()
        let qv = queryBuilder.update("sessions", {"Csrf" : hashId(csrf)})
        sessionId = hashId(sessionId);
        queryBuilder.where(qv, {"SessionId": sessionId})

        return new Promise((resolve, reject) => {
            connection.execute(
                qv.query, 
                qv.values,
                async (err, res) => {
                    if (err) reject(err);
                    else {
                        resolve(csrf)
                    }
                }
            )
        })
    },

    retrieveByUsername(username : string) : Promise<User | undefined> {
        let qv = queryBuilder.select("users")
        queryBuilder.where(qv, {"Username" : username})

        return new Promise((resolve, reject) => {
            connection.execute<User[]>(
                qv.query,
                qv.values,
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

    retrieveAll(limit : number = LIMIT_MAX, offset? : number) : Promise<User[]> {
        let qv = queryBuilder.select("users u INNER JOIN roleenum e ON u.Role = e.Id", [
            "u.Id", 
            "u.FirstName",
            "u.LastName",
            "u.Username",
            `e.Name as "Role"`, 
            "u.MobileNumber",
            "u.Email"
        ])
        queryBuilder.limit(qv, limit)
        queryBuilder.skip(qv, offset)

        return new Promise((resolve, reject) => {
            connection.execute<User[]>(
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

    retrieveById(id :  number) : Promise<User | undefined> {
        let qv = queryBuilder.select("users u", [
            "u.Id", 
            "u.FirstName",
            "u.LastName",
            "u.Username",
            "u.Role",
            "u.MobileNumber",
            "u.Email"
        ])
        queryBuilder.where(qv, {"id" : id})

        return new Promise((resolve, reject) => {
            connection.execute<User[]>(
                qv.query,
                qv.values,
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
    async upload(sessid : string, csrf : string, image : Express.Multer.File) : Promise<number>{
        let user = await  UserRepository.getUserFromSession(sessid, csrf)
        const id = user.Id;
        try {
            storeFile(image, "png")
            let qv = queryBuilder.update("users", {"Picture":  image.filename})
            queryBuilder.where(qv, {"Id" : id})
            return new Promise((resolve, reject) => {
                connection.execute<ResultSetHeader>(
                    qv.query,
                    qv.values,
                    (err, res) => {
                        if (err) reject(err);
                        else{
                            resolve(res.insertId);
                        }
                    }
                )
            })
        } catch(err){
            console.log(err);
        }
    },

    update(id : number, object : UserRow) : Promise<number> {
        let qv = queryBuilder.update(tableName, {
            "FirstName": object.FirstName,
            "LastName": object.LastName,
            "Username": object.Username,
            "Role": object.Role,
            "Email": object.Email,
            "MobileNumber": object.MobileNumber
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
        let qv1 = queryBuilder.delete("sessions")
        queryBuilder.where(qv1, {"UserId" : id})

        let qv2 = queryBuilder.delete(tableName)
        queryBuilder.where(qv2, {"Id" : id})

        let qv = queryBuilder.concat(qv1, qv2)

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

    deleteSession(sessionId : string) : Promise<number> {
        sessionId = hashId(sessionId);
        
        let query = `DELETE FROM sessions WHERE SessionId = ?`
            return new Promise((resolve, reject) => {
                connection.execute<ResultSetHeader>(
                    query,
                    [sessionId],
                    (err, res) => {
                        if (err) reject(err);
                        else{
                            resolve(1)
                        }
                    }
                )
            })
        },


    filter(query : UserQuery) : Promise<User[]> {
        let qv = makeSQLQuery(query)

        return new Promise((resolve, reject) => {
            connection.execute<User[]>(
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

export interface UserQuery {
    name : string,
    username: string ,
    email: string,
    mobileNumber: string,
    role: string,
    limit : number,
    skip : number,
}

export const makeSQLQuery = (query: UserQuery): QueryValuePair => {
    let qv = queryBuilder.select(tableName)
    queryBuilder.filter(qv, {
        "CONCAT(FirstName, LastName)" : query.name,
        "Email": query.email,
        "MobileNumber" : query.mobileNumber,
        "Username" : query.username
    })
    queryBuilder.limit(qv, query.limit)
    queryBuilder.skip(qv, query.skip)
    return qv
}