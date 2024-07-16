import express = require('express');
import enumsController from "../controllers/enum";
import validateRole from '../middleware/roleValidation';
import validateToken from '../middleware/authValidation';
import { RoleIds } from "../models/enum";

const router = express.Router();

router.get('/roles', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), enumsController.getAllRoles);
router.get('/roles/:name', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), (req, res) => {
    enumsController.getRoleByName(req, res);
});
router.get('/statuses', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), enumsController.getAllStatuses);
router.get('/statuses/:name', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), (req, res) => {
    enumsController.getStatusByName(req, res);
});
router.get('/types', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), enumsController.getAllTypes);
router.get('/types/:name', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), (req, res) => {
    enumsController.getTypeByName(req, res);
});

export default router;
