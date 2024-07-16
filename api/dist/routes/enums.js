"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const enum_1 = __importDefault(require("../controllers/enum"));
const roleValidation_1 = __importDefault(require("../middleware/roleValidation"));
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
const enum_2 = require("../models/enum");
const router = express.Router();
router.get('/roles', authValidation_1.default, (0, roleValidation_1.default)([enum_2.RoleIds.ADMIN, enum_2.RoleIds.VIEW_EDIT]), enum_1.default.getAllRoles);
router.get('/roles/:id', authValidation_1.default, (0, roleValidation_1.default)([enum_2.RoleIds.ADMIN, enum_2.RoleIds.VIEW_EDIT]), (req, res) => {
    enum_1.default.getRoleById(req, res);
});
router.get('/statuses', authValidation_1.default, (0, roleValidation_1.default)([enum_2.RoleIds.ADMIN, enum_2.RoleIds.VIEW_EDIT]), enum_1.default.getAllStatuses);
router.get('/statuses/:id', authValidation_1.default, (0, roleValidation_1.default)([enum_2.RoleIds.ADMIN, enum_2.RoleIds.VIEW_EDIT]), (req, res) => {
    enum_1.default.getStatusById(req, res);
});
router.get('/types', authValidation_1.default, (0, roleValidation_1.default)([enum_2.RoleIds.ADMIN, enum_2.RoleIds.VIEW_EDIT]), enum_1.default.getAllTypes);
router.get('/types/:id', authValidation_1.default, (0, roleValidation_1.default)([enum_2.RoleIds.ADMIN, enum_2.RoleIds.VIEW_EDIT]), (req, res) => {
    enum_1.default.getTypeById(req, res);
});
exports.default = router;
