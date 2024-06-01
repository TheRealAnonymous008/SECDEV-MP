import { sql, db, VercelPoolClient, Query, QueryResult } from "@vercel/postgres"

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

export const executeTransaction = async (body : TransactionStatement[], errhandler? : () => void ) : Promise<QueryResult[]> => {
    try {
        console.log("Called", body)
        const client = await db.connect()
        
        const results = []
        await client.query(`BEGIN;`)

        body.forEach(async (txn : TransactionStatement) => {
            if(txn.values){
                await client.query(txn.statement, txn.values)
                    .then(result => {
                        results.push(result)
                    })
                    .catch(error => {
                        console.log(error)
                        if(errhandler) 
                            errhandler()
                    });
            } else {
                await client.query(txn.statement)
                    .catch(error => {
                        console.log(error)
                        if (errhandler)
                            errhandler()
                    })
            }
        })

        await client.query(`END;`)

        return results;
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