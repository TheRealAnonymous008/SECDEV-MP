import { db, sql } from '@vercel/postgres'
import express = require('express')
import { executeTransaction } from '../txn/transaction';



const initialize = async(req : express.Request, res : express.Response) => {
    try {
        // RoleEnum
        await sql`
        DROP TABLE IF EXISTS "RoleEnum" CASCADE;
        `
        
        await sql`
        CREATE TABLE IF NOT EXISTS "RoleEnum" (
            "Id" SERIAL NOT NULL,
            "Name" VARCHAR(45) NOT NULL,
            PRIMARY KEY ("Id", "Name"),
            UNIQUE ("Id")
        );
        `;
        
        await executeTransaction([
            `INSERT INTO "RoleEnum" ("Id", "Name") VALUES (1, 'ADMIN');`,
            `INSERT INTO "RoleEnum" ("Id", "Name") VALUES (2, 'VIEW EDIT');`,
            `INSERT INTO "RoleEnum" ("Id", "Name") VALUES (3, 'VIEW');`
        ])

        // Users
        await sql`
        DROP TABLE IF EXISTS "Users" CASCADE;
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

        // Type Enum
        await sql`
        DROP TABLE IF EXISTS "TypeEnum" CASCADE;
        `
        await sql`
        CREATE TABLE IF NOT EXISTS "TypeEnum" (
            "Id" SERIAL NOT NULL,
            "Name" VARCHAR(45) NOT NULL,
            PRIMARY KEY ("Id", "Name"),
            UNIQUE ("Id")
        );
        `

        await executeTransaction([
            `INSERT INTO "TypeEnum" ("Id", "Name") VALUES (1, 'PERSONAL');`,
            `INSERT INTO "TypeEnum" ("Id", "Name") VALUES (2, 'WALK IN');`,
            `INSERT INTO "TypeEnum" ("Id", "Name") VALUES (3, 'FLEET');`,
            `INSERT INTO "TypeEnum" ("Id", "Name") VALUES (4, 'INSURANCE');`
        ])

        // Status Enum
        await sql`
        DROP TABLE IF EXISTS "StatusEnum" CASCADE;
        `

        await sql`
        CREATE TABLE IF NOT EXISTS "StatusEnum" (
            "Id" SERIAL NOT NULL,
            "Name" VARCHAR(45) NOT NULL,
            PRIMARY KEY ("Id", "Name"),
            UNIQUE ("Id")
        );
        `

        await executeTransaction([
            `INSERT INTO "StatusEnum" ("Id", "Name") VALUES (1, 'PAID');`,
            `INSERT INTO "StatusEnum" ("Id", "Name") VALUES (2, 'UNPAID');`,
            `INSERT INTO "StatusEnum" ("Id", "Name") VALUES (3, 'OK');`,
            `INSERT INTO "StatusEnum" ("Id", "Name") VALUES (4, 'PENDING');`,
            `INSERT INTO "StatusEnum" ("Id", "Name") VALUES (5, 'WITH BALANCE');`,
            `INSERT INTO "StatusEnum" ("Id", "Name") VALUES (6, 'QUOTE OR CHECK');`,
            `INSERT INTO "StatusEnum" ("Id", "Name") VALUES (7, 'FOR LOA OR INVOICE');`
        ])

        // Customer 
        await sql`
        DROP TABLE IF EXISTS "Customer" CASCADE;
        `

        await sql`
        CREATE TABLE IF NOT EXISTS "Customer" (
            "Id" SERIAL PRIMARY KEY,
            "FirstName" VARCHAR(45),
            "LastName" VARCHAR(45),
            "MobileNumber" VARCHAR(10),
            "Email" VARCHAR(45),
            "Company" VARCHAR(45),
            "Insurance" VARCHAR(45),
            "Remarks" VARCHAR(256),
            UNIQUE ("Id")
        );
        `

        // Vehicle
        await sql`
        DROP TABLE IF EXISTS "Vehicle" CASCADE;
        `

        await sql`CREATE TABLE IF NOT EXISTS "Vehicle" (
            "Id" SERIAL PRIMARY KEY,
            "LicensePlate" VARCHAR(8),
            "Manufacturer" VARCHAR(45),
            "Model" VARCHAR(45),
            "YearManufactured" TIMESTAMP,
            "Color" VARCHAR(45),
            "Engine" VARCHAR(45),
            "Remarks" VARCHAR(256)
        );
        `

        // Orders
        await sql`
        DROP TABLE IF EXISTS "Order" CASCADE;
        `

        await sql`
        CREATE TABLE IF NOT EXISTS "Order" (
            "ID" INT NOT NULL,
            "Status" INT NOT NULL,
            "TimeIn" TIMESTAMP NULL,
            "TimeOut" TIMESTAMP NULL,
            "CustomerId" INT NOT NULL,
            "TypeId" INT NOT NULL,
            "VehicleId" INT NOT NULL,
            "EstimateNumber" VARCHAR(45) NULL,
            "ScopeOfWork" VARCHAR(1024) NULL,
            "IsVerified" BOOLEAN NOT NULL,
            PRIMARY KEY ("ID"),
            UNIQUE ("ID"),
            FOREIGN KEY ("CustomerId")
                REFERENCES "Customer" ("Id")
                ON DELETE NO ACTION
                ON UPDATE NO ACTION,
            FOREIGN KEY ("VehicleId")
                REFERENCES "Vehicle" ("Id")
                ON DELETE NO ACTION
                ON UPDATE NO ACTION,
            FOREIGN KEY ("TypeId")
                REFERENCES "TypeEnum" ("Id")
                ON DELETE NO ACTION
                ON UPDATE NO ACTION,
            FOREIGN KEY ("Status")
                REFERENCES "StatusEnum" ("Id")
                ON DELETE NO ACTION
                ON UPDATE NO ACTION
        );
        `

        await sql`CREATE INDEX "fk_Order_Customer_idx" ON "Order" ("CustomerId");`
        await sql`CREATE INDEX "fk_Order_Vehicle1_idx" ON "Order" ("VehicleId");`
        await sql`CREATE INDEX "fk_Order_TypeEnum1_idx" ON "Order" ("TypeId");`


        return res.status(200).end(); 
    }
    catch (error) {
        console.log(error);
        return res.status(500).end()
    }
}

export default {initialize};