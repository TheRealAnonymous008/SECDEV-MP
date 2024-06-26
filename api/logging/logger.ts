import { LOG_LEVEL, LogLevel } from "../config/logConfig"

const log = (level : LogLevel, what : string) => {
    if (LOG_LEVEL >= level)
        console.log(what)
}

export default {log}

