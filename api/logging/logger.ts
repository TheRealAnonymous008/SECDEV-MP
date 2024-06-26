import { LOG_LEVEL, LogLevel } from "../config/logConfig";

const log = (level : LogLevel, what : string) => {
    if (LOG_LEVEL >= level) {
        const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
        const greenTimestamp = `\x1b[32m[${timestamp}]\x1b[0m`;

        let levelStr = '';
        let colorCode = '';

        switch(level) {
            case LogLevel.STACK_TRACE:
                levelStr = 'STACK_TRACE';
                colorCode = '\x1b[35m'; // Magenta
                break;
            case LogLevel.ERRORS:
                levelStr = 'ERROR';
                colorCode = '\x1b[31m'; // Red
                break;
            case LogLevel.DEBUG:
                levelStr = 'DEBUG';
                colorCode = '\x1b[34m'; // Blue
                break;
            case LogLevel.AUDIT:
                levelStr = 'AUDIT';
                colorCode = '\x1b[33m'; // Yellow
                break;
        }

        const coloredLevel = `${colorCode}${levelStr}\x1b[0m`;
        console.log(`${greenTimestamp} ${coloredLevel} ${what}`);
    }
}

export default { log };