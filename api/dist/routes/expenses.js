"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const expenses_1 = __importDefault(require("../controllers/expenses"));
const roleValidation_1 = __importDefault(require("../middleware/roleValidation"));
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
const enum_1 = require("../models/enum");
const router = express.Router();
router.get('/all', authValidation_1.default, (0, roleValidation_1.default)([enum_1.RoleIds.ADMIN, enum_1.RoleIds.VIEW_EDIT, enum_1.RoleIds.VIEW]), expenses_1.default.all);
router.get('/id', authValidation_1.default, (0, roleValidation_1.default)([enum_1.RoleIds.ADMIN, enum_1.RoleIds.VIEW_EDIT, enum_1.RoleIds.VIEW]), expenses_1.default.id);
router.post('/create', authValidation_1.default, (0, roleValidation_1.default)([enum_1.RoleIds.ADMIN, enum_1.RoleIds.VIEW_EDIT]), expenses_1.default.create);
router.post('/update', authValidation_1.default, (0, roleValidation_1.default)([enum_1.RoleIds.ADMIN, enum_1.RoleIds.VIEW_EDIT]), expenses_1.default.update);
router.delete('/delete', authValidation_1.default, (0, roleValidation_1.default)([enum_1.RoleIds.ADMIN, enum_1.RoleIds.VIEW_EDIT]), expenses_1.default.remove);
// router.get('/filter', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT, RoleIds.VIEW]), expensesController.filter);
exports.default = router;
