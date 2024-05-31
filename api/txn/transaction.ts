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

export const executeTransaction = async (body : TransactionStatement[], errhandler? : () => void ) => {
    try {
        const client = await db.connect();
        await sql`BEGIN;`

        body.forEach(async (txn : TransactionStatement) => {
            if(txn.values){
                await client.query(txn.statement, txn.values)
                    .catch(error => {
                        if(errhandler) 
                            errhandler()
                    });
            } else {
                await client.query(txn.statement)
                    .catch(error => {
                        if (errhandler)
                        errhandler()
                    })
            }
        })

        await sql`END;`
    }
    catch (error) {
        if(errhandler)
            errhandler();
    }
}

export class TransactionFailedException extends Error {
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, TransactionFailedException.prototype);
    }
}