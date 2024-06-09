"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authz_1 = __importDefault(require("../controllers/authz"));
const router = express.Router();
const express_rate_limit_1 = require("express-rate-limit");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// Rate limiter for login capping
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 5 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
router.get('/verify', authz_1.default.verify);
router.post('/register', authz_1.default.register);
router.post('/login', limiter, authz_1.default.login);
router.post('/logout', authz_1.default.logout);
exports.default = router;
