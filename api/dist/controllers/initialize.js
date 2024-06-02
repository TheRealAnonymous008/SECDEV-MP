"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("@vercel/postgres");
const transaction_1 = require("../txn/transaction");
const initialize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // RoleEnum
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS "RoleEnum" CASCADE;
        `;
        yield (0, postgres_1.sql) `
        CREATE TABLE IF NOT EXISTS "RoleEnum" (
            "Id" SERIAL NOT NULL,
            "Name" VARCHAR(45) NOT NULL,
            PRIMARY KEY ("Id", "Name"),
            UNIQUE ("Id")
        );
        `;
        yield (0, transaction_1.executeTransaction)([
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "RoleEnum" ("Id", "Name") VALUES (1, 'ADMIN');`),
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "RoleEnum" ("Id", "Name") VALUES (2, 'VIEW EDIT');`),
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "RoleEnum" ("Id", "Name") VALUES (3, 'VIEW');`)
        ]);
        // Users
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS "Users" CASCADE;
        `;
        yield (0, postgres_1.sql) `
        CREATE TABLE IF NOT EXISTS "Users" (
            "FirstName" VARCHAR(45) NOT NULL,
            "LastName" VARCHAR(45) NOT NULL,
            "Username" VARCHAR(45) NOT NULL PRIMARY KEY,
            "Password" VARCHAR(64) NOT NULL,
            "Role" INT NOT NULL,
            "MobileNumber" VARCHAR(45) NOT NULL,
            "Email" VARCHAR(45) NOT NULL,
            UNIQUE ("Username"),
            CONSTRAINT "fk_Users_RoleEnum"
              FOREIGN KEY ("Role")
              REFERENCES "RoleEnum" ("Id")
              ON DELETE NO ACTION
              ON UPDATE NO ACTION
        );
        `;
        // Type Enum
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS "TypeEnum" CASCADE;
        `;
        yield (0, postgres_1.sql) `
        CREATE TABLE IF NOT EXISTS "TypeEnum" (
            "Id" SERIAL NOT NULL,
            "Name" VARCHAR(45) NOT NULL,
            PRIMARY KEY ("Id", "Name"),
            UNIQUE ("Id")
        );
        `;
        yield (0, transaction_1.executeTransaction)([
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "TypeEnum" ("Id", "Name") VALUES (1, 'PERSONAL');`),
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "TypeEnum" ("Id", "Name") VALUES (2, 'WALK IN');`),
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "TypeEnum" ("Id", "Name") VALUES (3, 'FLEET');`),
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "TypeEnum" ("Id", "Name") VALUES (4, 'INSURANCE');`)
        ]);
        // Status Enum
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS "StatusEnum" CASCADE;
        `;
        yield (0, postgres_1.sql) `
        CREATE TABLE IF NOT EXISTS "StatusEnum" (
            "Id" SERIAL NOT NULL,
            "Name" VARCHAR(45) NOT NULL,
            PRIMARY KEY ("Id", "Name"),
            UNIQUE ("Id")
        );
        `;
        yield (0, transaction_1.executeTransaction)([
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "StatusEnum" ("Id", "Name") VALUES (1, 'PAID');`),
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "StatusEnum" ("Id", "Name") VALUES (2, 'UNPAID');`),
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "StatusEnum" ("Id", "Name") VALUES (3, 'OK');`),
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "StatusEnum" ("Id", "Name") VALUES (4, 'PENDING');`),
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "StatusEnum" ("Id", "Name") VALUES (5, 'WITH BALANCE');`),
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "StatusEnum" ("Id", "Name") VALUES (6, 'QUOTE OR CHECK');`),
            (0, transaction_1.buildTransactionStatement)(`INSERT INTO "StatusEnum" ("Id", "Name") VALUES (7, 'FOR LOA OR INVOICE');`)
        ]);
        // Customer 
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS "Customer" CASCADE;
        `;
        yield (0, postgres_1.sql) `
        CREATE TABLE IF NOT EXISTS "Customer" (
            "Id" SERIAL PRIMARY KEY,
            "FirstName" VARCHAR(45),
            "LastName" VARCHAR(45),
            "MobileNumber" VARCHAR(11),
            "Email" VARCHAR(45),
            "Company" VARCHAR(45),
            "Insurance" VARCHAR(45),
            "Remarks" VARCHAR(256),
            UNIQUE ("Id")
        );
        `;
        yield (0, transaction_1.executeTransaction)([
            (0, transaction_1.buildTransactionStatement)(`
                INSERT INTO "Customer" ("FirstName", "LastName", "MobileNumber", "Email", "Company", "Insurance", "Remarks")
                VALUES
                ('John', 'Doe', '1234567890', 'john.doe@example.com', 'Example Corp', 'ABC Insurance', 'No remarks'),
                ('Jane', 'Smith', '0987654321', 'jane.smith@example.com', 'Tech Solutions', 'XYZ Insurance', 'Important client'),
                ('Alice', 'Johnson', '1112223333', 'alice.johnson@example.com', 'Innovate Inc', 'LMN Insurance', 'Frequent customer'),
                ('Bob', 'Williams', '4445556666', 'bob.williams@example.com', 'BuildWorks', 'OPQ Insurance', 'Pending review');                
                `)
        ]);
        // Vehicle
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS "Vehicle" CASCADE;
        `;
        yield (0, postgres_1.sql) `CREATE TABLE IF NOT EXISTS "Vehicle" (
            "Id" SERIAL PRIMARY KEY,
            "LicensePlate" VARCHAR(8),
            "Manufacturer" VARCHAR(45),
            "Model" VARCHAR(45),
            "YearManufactured" TIMESTAMP,
            "Color" VARCHAR(45),
            "Engine" VARCHAR(45),
            "Remarks" VARCHAR(256)
        );
        `;
        // Orders
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS "Order" CASCADE;
        `;
        yield (0, postgres_1.sql) `
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
        `;
        yield (0, postgres_1.sql) `CREATE INDEX "fk_Order_Customer_idx" ON "Order" ("CustomerId");`;
        yield (0, postgres_1.sql) `CREATE INDEX "fk_Order_Vehicle1_idx" ON "Order" ("VehicleId");`;
        yield (0, postgres_1.sql) `CREATE INDEX "fk_Order_TypeEnum1_idx" ON "Order" ("TypeId");`;
        return res.status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).end();
    }
});
exports.default = { initialize };
