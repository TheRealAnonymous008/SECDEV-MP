"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logConfig_1 = require("../config/logConfig");
const log = (level, what) => {
    if (logConfig_1.LOG_LEVEL >= level) {
        const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
        const greenTimestamp = `\x1b[32m[${timestamp}]\x1b[0m`;
        let levelStr = '';
        let colorCode = '';
        switch (level) {
            case logConfig_1.LogLevel.STACK_TRACE:
                levelStr = 'STACK_TRACE';
                colorCode = '\x1b[35m'; // Magenta
                break;
            case logConfig_1.LogLevel.ERRORS:
                levelStr = 'ERROR';
                colorCode = '\x1b[31m'; // Red
                break;
            case logConfig_1.LogLevel.DEBUG:
                levelStr = 'DEBUG';
                colorCode = '\x1b[34m'; // Blue
                break;
            case logConfig_1.LogLevel.AUDIT:
                levelStr = 'AUDIT';
                colorCode = '\x1b[33m'; // Yellow
                break;
        }
        const coloredLevel = `${colorCode}${levelStr}\x1b[0m`;
        console.log(`${greenTimestamp} ${coloredLevel} ${what}`);
    }
};
exports.default = { log };
