"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logConfig_1 = require("../config/logConfig");
const winston_1 = __importDefault(require("winston"));
const os_1 = __importDefault(require("os"));
const hostname = os_1.default.hostname(); // Get the system hostname
const pid = process.pid; // Get the process ID
const logger = winston_1.default.createLogger({
    level: 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), // RFC 5424 timestamp format
    winston_1.default.format.printf(({ timestamp, level, message }) => {
        return `<134>1 ${timestamp} ${hostname} AUTOWORKS ${pid} - - [${level.toUpperCase()}] ${message}`;
    })),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message }) => {
                return `<134>1 ${timestamp} ${hostname} AUTOWORKS ${pid} - - [${level.toUpperCase()}] ${message}`;
            }))
        }),
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'logs/combined.log' })
    ]
});
// Map custom log levels to Winston
const logLevelMap = {
    [logConfig_1.LogLevel.STACK_TRACE]: 'debug',
    [logConfig_1.LogLevel.ERRORS]: 'error',
    [logConfig_1.LogLevel.DEBUG]: 'debug',
    [logConfig_1.LogLevel.AUDIT]: 'info'
};
const log = (level, what) => {
    if (logConfig_1.LOG_LEVEL >= level) {
        const winstonLevel = logLevelMap[level];
        logger.log(winstonLevel, what);
    }
};
exports.default = { log };
