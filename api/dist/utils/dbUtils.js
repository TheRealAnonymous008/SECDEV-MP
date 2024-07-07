"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryBuilder = void 0;
const limiterConfig_1 = require("../config/limiterConfig");
const inputValidation_1 = require("../middleware/inputValidation");
const DB_NAME = process.env.DB_DATABASE;
const tableName = (table) => { return DB_NAME + "." + table; };
const select = (table, filter = []) => {
    if (filter.length == 0) {
        return {
            query: `SELECT * FROM ${tableName(table)}`,
            values: []
        };
    }
    const f = filter.join(', ');
    return {
        query: `SELECT ${f} FROM ${tableName(table)}`,
        values: []
    };
};
const insert = (table, kvs) => {
    let query = `INSERT INTO ${tableName(table)}`;
    let values = [];
    let insertStatement = Object.keys(kvs).join(',');
    let valueAlias = [];
    values = Object.values(kvs);
    values.forEach((v) => { valueAlias.push("?"); });
    let valueStatement = "VALUES (" + valueAlias.join(',') + ")";
    query += "(" + insertStatement + ")" + valueStatement;
    return {
        query: query,
        values: values
    };
};
const update = (table, kvs) => {
    let query = `UPDATE ${tableName(table)}`;
    let values = [];
    let updateStatement = [];
    Object.keys(kvs).forEach((key) => {
        updateStatement.push(key + " = ?");
        values.push(kvs[key]);
    });
    query += " SET " + updateStatement.join(',');
    return {
        query: query,
        values: values
    };
};
const remove = (table) => {
    return {
        query: `DELETE FROM ${tableName(table)}`,
        values: []
    };
};
const count = (table) => {
    return {
        query: `SELECT COUNT(*) FROM ${tableName(table)}`,
        values: []
    };
};
const filter = (qv, kvs) => {
    let query = qv.query;
    let values = qv.values;
    let whereClauses = [];
    Object.keys(kvs).forEach((key) => {
        const value = kvs[key];
        if (value !== undefined && value !== null) {
            whereClauses.push(key + " LIKE ?");
            values.push(like(value));
        }
    });
    if (whereClauses.length > 0) {
        query += " WHERE " + whereClauses.join(" AND ");
    }
    qv.query = query;
    qv.values = values;
    return qv;
};
const where = (qv, kvs) => {
    let query = qv.query;
    let values = qv.values;
    let whereClauses = [];
    Object.keys(kvs).forEach((key) => {
        const value = kvs[key];
        if (value !== undefined && value !== null) {
            whereClauses.push(key + " = ? ");
            values.push(value);
        }
    });
    if (whereClauses.length > 0) {
        query += " WHERE " + whereClauses.join(" AND ");
    }
    qv.query = query;
    qv.values = values;
    return qv;
};
const like = (str) => {
    return "%" + str + "%";
};
const limit = (qv, limit) => {
    qv.query += ` LIMIT `;
    if (limit) {
        limit = (0, inputValidation_1.validateLimit)(limit);
        qv.query += (limit);
    }
    else {
        qv.query += (limiterConfig_1.LIMIT_MAX);
    }
    return qv;
};
const skip = (qv, skip) => {
    if (skip) {
        qv.query += ` OFFSET `;
        skip = (0, inputValidation_1.validateNonNegative)(skip.toString());
        qv.query += skip;
    }
    return qv;
};
const concat = (q1, q2) => {
    return {
        query: q1.query + "; " + q2.query,
        values: q1.values.concat(q2.values)
    };
};
exports.queryBuilder = { select, insert, update, delete: remove, like, where, filter, limit, skip, count, concat };
