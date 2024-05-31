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
const initialize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS "Users";
        `;
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS "RoleEnum";
        `;
        yield (0, postgres_1.sql) `
        CREATE TABLE IF NOT EXISTS "RoleEnum" (
            "Id" SERIAL NOT NULL,
            "Name" VARCHAR(45) NOT NULL,
            PRIMARY KEY ("Id", "Name"),
            UNIQUE ("Id")
        );
        `;
        yield (0, postgres_1.sql) `
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
        `;
        return res.status(200).end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).end();
    }
});
exports.default = { initialize };
