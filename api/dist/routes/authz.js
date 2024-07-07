"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authz_1 = __importDefault(require("../controllers/authz"));
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
const limiterConfig_1 = require("../config/limiterConfig");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.get('/handshake', limiterConfig_1.limiter, authValidation_1.default, authz_1.default.handshake);
router.post('/register', limiterConfig_1.limiter, authz_1.default.register);
router.post('/login', limiterConfig_1.limiter, authz_1.default.login);
router.post('/logout', authz_1.default.logout);
exports.default = router;
