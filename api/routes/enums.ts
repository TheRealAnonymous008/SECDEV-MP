import express = require('express');
import enumsController from "../controllers/enum";
import validateRole from '../middleware/roleValidation';
import validateToken from '../middleware/authValidation';
import { RoleIds } from "../models/enum";

const router = express.Router();

router.get('/roles', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), enumsController.getAllRoles);
router.get('/roles/:name', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), (req, res, next) => {
    enumsController.getRoleByName(req, res, next);
});
router.get('/statuses', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), enumsController.getAllStatuses);
router.get('/statuses/:name', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), (req, res, next) => {
    enumsController.getStatusByName(req, res, next);
});
router.get('/types', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), enumsController.getAllTypes);
router.get('/types/:name', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), (req, res, next) => {
    enumsController.getTypeByName(req, res, next);
});

export default router;
