"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
// Rate limiter for login capping
exports.limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: parseInt(process.env.RATE_LIMITER_WINDOW_MS),
    limit: parseInt(process.env.RATE_LIMITER_LIMIT),
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests. Try again later",
});
