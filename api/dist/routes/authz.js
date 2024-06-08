"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authz_1 = __importDefault(require("../controllers/authz"));
const inputValidation = __importStar(require("../middleware/inputValidation"));
const router = express.Router();
const express_rate_limit_1 = require("express-rate-limit");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
function validateRequestBody(req, res, next) {
    //console.log("validateRequestbody called");
    try {
        try {
            inputValidation.validateRegistrationInput(req.body.firstName, req.body.lastName, req.body.username, req.body.password, req.body.mobileNumber, req.body.email);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
}
// Rate limiter for login capping
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 5 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
router.get('/verify', authz_1.default.verify);
router.post('/register', validateRequestBody, authz_1.default.register);
router.post('/login', limiter, authz_1.default.login);
router.post('/logout', authz_1.default.logout);
exports.default = router;
