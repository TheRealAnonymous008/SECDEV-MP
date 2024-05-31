import { sql, db, VercelPoolClient } from "@vercel/postgres"


export const executeTransaction = async (statements : string[]) => {
    const client = await db.connect();
    await sql`BEGIN;`

    statements.forEach(async (statement : string) => {
        client.query(statement)
    })

    await sql`END;`
}