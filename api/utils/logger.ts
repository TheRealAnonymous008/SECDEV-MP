import { LOG_LEVEL, LogLevel } from "../config/logConfig";
import winston from 'winston';
import os from 'os';

const hostname = os.hostname(); // Get the system hostname
const pid = process.pid; // Get the process ID

const logger = winston.createLogger({
  level: 'debug', // Default level (lowest)
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), // RFC 5424 timestamp format
    winston.format.printf(({ timestamp, level, message }) => {
      return `<134>1 ${timestamp} ${hostname} AUTOWORKS ${pid} - - [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `<134>1 ${timestamp} ${hostname} AUTOWORKS ${pid} - - [${level.toUpperCase()}] ${message}`;
        })
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Map custom log levels to Winston
const logLevelMap = {
  [LogLevel.STACK_TRACE]: 'debug', 
  [LogLevel.ERRORS]: 'error',
  [LogLevel.DEBUG]: 'debug',
  [LogLevel.AUDIT]: 'info'
};

const log = (level: LogLevel, what: string) => {
  if (LOG_LEVEL >= level) {
    const winstonLevel = logLevelMap[level];
    logger.log(winstonLevel, what);
  }
}

export default { log };
