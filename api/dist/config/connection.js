"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dbConfig_1 = __importDefault(require("./dbConfig"));
exports.default = mysql2_1.default.createConnection({
    host: dbConfig_1.default.host,
    user: dbConfig_1.default.user,
    password: dbConfig_1.default.password,
    database: dbConfig_1.default.database
});
