"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_LEVEL = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["QUIET"] = 0] = "QUIET";
    LogLevel[LogLevel["AUDIT"] = 1] = "AUDIT";
    LogLevel[LogLevel["DEBUG"] = 2] = "DEBUG";
    LogLevel[LogLevel["ERRORS"] = 3] = "ERRORS";
    LogLevel[LogLevel["STACK_TRACE"] = 4] = "STACK_TRACE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.LOG_LEVEL = LogLevel.STACK_TRACE;
