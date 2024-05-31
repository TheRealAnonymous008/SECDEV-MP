import { sql } from '@vercel/postgres'
import express = require('express')

const all = async(req : express.Request, res : express.Response) => {
    try {
        const result = 
        await sql`
        CREATE TABLE IF NOT EXISTS "Users" (
            "Id" SERIAL PRIMARY KEY,
            "FirstName" VARCHAR(45) NOT NULL,
            "LastName" VARCHAR(45) NOT NULL,
            "Username" VARCHAR(45) NOT NULL,
            "Password" VARCHAR(45) NOT NULL,
            "Role" INT NOT NULL,
            "MobileNumber" VARCHAR(45) NOT NULL,
            "Email" VARCHAR(45) NOT NULL,
            UNIQUE ("Id"),
            CONSTRAINT "fk_Users_RoleEnum"
              FOREIGN KEY ("Role")
              REFERENCES "RoleEnum" ("Id")
              ON DELETE NO ACTION
              ON UPDATE NO ACTION
        );
        `

        res = res.status(200);
        return res.json(result);
    }
    catch (error) {
        return res.status(500)
    }
}