import { db, sql } from '@vercel/postgres'
import express = require('express')


const all = async(req : express.Request, res : express.Response) => {
    try {
        await sql`
        DROP TABLE IF EXISTS "RoleEnum";
        `

        await sql`
        CREATE TABLE IF NOT EXISTS "RoleEnum" (
            "Id" SERIAL NOT NULL,
            "Name" VARCHAR(45) NOT NULL,
            PRIMARY KEY ("Id", "Name"),
            UNIQUE ("Id")
        );
        `;

        
        await sql`
        DROP TABLE IF EXISTS "Users";
        `
        
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

        return res.status(200);
    }
    catch (error) {
        console.log(error);
        return res.status(500)
    }
}

export default {all};