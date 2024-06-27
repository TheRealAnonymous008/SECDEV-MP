export enum LogLevel {
    QUIET,          // Displays nothing
    AUDIT,          // Displays console logs for every action performed and by whom
    DEBUG,          // Displays additional console logs that provide debugging information
    ERRORS,         // Displays only error messages
    STACK_TRACE,    // Displays all stack traces
}

export const LOG_LEVEL : LogLevel = parseInt(process.env.LOG_LEVEL)