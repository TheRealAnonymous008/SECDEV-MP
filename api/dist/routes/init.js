"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const initialize_1 = __importDefault(require("../controllers/initialize"));
const router = express.Router();
router.get('/', initialize_1.default.initialize);
exports.default = router;
