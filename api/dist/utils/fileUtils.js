"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeFile = void 0;
const cryptoUtils_1 = require("./cryptoUtils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Assuming FILE_ROOT is defined in your environment variables
const FILE_ROOT = process.env.FILE_ROOT;
const storeFile = (file, ext) => {
    try {
        file.filename = (0, cryptoUtils_1.getTimestamp)().toString() + (0, cryptoUtils_1.getRandom)();
        return new Promise((resolve, reject) => {
            const filePath = path_1.default.join(FILE_ROOT, './uploads', file.filename + +"." + ext);
            fs_1.default.writeFile(filePath, file.buffer, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(filePath);
            });
        });
    }
    catch (err) {
        throw err;
    }
};
exports.storeFile = storeFile;
