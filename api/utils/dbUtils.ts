import { LIMIT_MAX } from "../config/limiterConfig"
import { validateLimit, validateNonNegative } from "../middleware/inputValidation";

export interface QueryValuePair {
    query : string, 
    values : (string | number)[], 
}


const DB_NAME = process.env.DB_DATABASE;

const tableName = (table : string) => {return DB_NAME + "." + table}

const select = (table : string, filter : string[] = []) : QueryValuePair => {
    if (filter.length == 0) {
        return {
            query : `SELECT * FROM ${tableName(table)}`,
            values: []
        }
    }

    const f = filter.join(', ')
    return {
        query : `SELECT ${f} FROM ${tableName(table)}`,
        values: []
    }
}

const insert = (table : string, kvs : {[key : string] : any}) : QueryValuePair => {
    let query = `INSERT INTO ${tableName(table)}`
    let values = []

    let insertStatement = Object.keys(kvs).join(',')
    let valueAlias = []

    values = Object.values(kvs)
    values.forEach((v) => {valueAlias.push("?")})

    let valueStatement = "VALUES (" + valueAlias.join(',') + ")"  
    query += "(" + insertStatement + ")" + valueStatement

    return {
        query: query, 
        values : values
    }
}


const update = (table : string, kvs : {[key : string] : any}) : QueryValuePair => {
    let query = `UPDATE ${tableName(table)}`
    let values = []

    let updateStatement = []
    Object.keys(kvs).forEach((key) => {
        updateStatement.push(key + " = ?")
        values.push(kvs[key])
    })

    query += " SET " + updateStatement.join(',')
    return {
        query: query, 
        values : values
    }
}

const remove = (table : string) : QueryValuePair => {
    return {
        query : `DELETE FROM ${tableName(table)}`,
        values: []
    }
}

const count = (table : string) : QueryValuePair => {
    return {
        query : `SELECT COUNT(*) FROM ${tableName(table)}`,
        values: []
    }
}
const filter = (qv : QueryValuePair, kvs : {[key : string] : any}) : QueryValuePair => {
    let query = qv.query
    let values = qv.values

    let whereClauses = []
    
    Object.keys(kvs).forEach((key) => {
        const value = kvs[key]
        if (value !== undefined && value !== null){
            whereClauses.push(key + " LIKE ?")
            values.push(like(value))
        }
    })

    if (whereClauses.length > 0) {
        query += " WHERE " + whereClauses.join(" AND ");
    }

    qv.query = query 
    qv.values = values
    return qv
}

const where = (qv : QueryValuePair, kvs : {[key : string] : any}) : QueryValuePair => {
    let query = qv.query
    let values = qv.values

    let whereClauses = []
    
    Object.keys(kvs).forEach((key) => {
        const value = kvs[key]
        if (value !== undefined && value !== null){
            whereClauses.push(key + " = ? ")
            values.push(value)
        }
    })

    if (whereClauses.length > 0) {
        query += " WHERE " + whereClauses.join(" AND ");
    }

    qv.query = query 
    qv.values = values
    return qv
}

const like = (str : string) => {
    return "%" + str + "%"
}

const limit = (qv : QueryValuePair, limit : number) : QueryValuePair => {
    qv.query += ` LIMIT `;
    if (limit) {
        limit = validateLimit(limit)
        qv.query += (limit);
    } else {
        qv.query += (LIMIT_MAX)
    }
    return qv
}

const skip = (qv : QueryValuePair, skip : number) : QueryValuePair => {
    if (skip) {
        qv.query += ` OFFSET `;
        skip = validateNonNegative(skip.toString())
        qv.query += skip;
    }
    return qv
}

const concat = (q1 : QueryValuePair, q2: QueryValuePair) : QueryValuePair => {
    return {
        query: q1.query + "; " + q2.query,
        values: q1.values.concat(q2.values)
    }
}

export const queryBuilder = {select, insert, update, delete : remove, like, where, filter, limit, skip, count, concat}