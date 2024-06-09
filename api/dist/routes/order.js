"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const order_1 = __importDefault(require("../controllers/order"));
const enum_1 = require("../models/enum");
const roleValidation_1 = __importDefault(require("../middleware/roleValidation"));
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
const router = express.Router();
router.get('/all', authValidation_1.default, (0, roleValidation_1.default)([enum_1.RoleIds.ADMIN, enum_1.RoleIds.VIEW_EDIT, enum_1.RoleIds.VIEW]), order_1.default.all);
router.get('/id', authValidation_1.default, (0, roleValidation_1.default)([enum_1.RoleIds.ADMIN, enum_1.RoleIds.VIEW_EDIT, enum_1.RoleIds.VIEW]), order_1.default.id);
// router.post('/create', validateToken, validateRole([Roles.ADMIN, Roles.VIEW_EDIT]), controller.create);
// router.post('/update', validateToken, validateRole([Roles.ADMIN, Roles.VIEW_EDIT]), controller.update);
// router.delete('/delete', validateToken, validateRole([Roles.ADMIN, Roles.VIEW_EDIT]), controller.remove);
// router.get('/filter', validateToken, validateRole(ALL_ROLES), controller.filter);
// router.post('/verify', validateToken, validateRole([Roles.ADMIN]), controller.verify);
exports.default = router;
