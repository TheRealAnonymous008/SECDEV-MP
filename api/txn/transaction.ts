import { sql, db, VercelPoolClient, Query } from "@vercel/postgres"

export interface TransactionStatement {
    statement : string,
    values? : any[]
}

export const buildTransactionStatement = (statement : string, values : any[] = []) : TransactionStatement => {
    return {
        statement : statement,
        values : values
    };
}

export const executeTransaction = async (body : TransactionStatement[]) => {
    const client = await db.connect();
    await sql`BEGIN;`

    body.forEach(async (txn : TransactionStatement) => {
        if(txn.values){
            client.query(txn.statement, txn.values);
        } else {
            client.query(txn.statement)
        }
    })

    await sql`END;`
}