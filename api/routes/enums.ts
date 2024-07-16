import express = require('express');
import enumsController from "../controllers/enum";
import validateRole from '../middleware/roleValidation';
import validateToken from '../middleware/authValidation';
import { RoleIds } from "../models/enum";

const router = express.Router();

router.get('/roles', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), enumsController.getAllRoles);
router.get('/roles/:id', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), (req, res) => {
    enumsController.getRoleById(req, res);
});
router.get('/statuses', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), enumsController.getAllStatuses);
router.get('/statuses/:id', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), (req, res) => {
    enumsController.getStatusById(req, res);
});
router.get('/types', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), enumsController.getAllTypes);
router.get('/types/:id', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), (req, res) => {
    enumsController.getTypeById(req, res);
});

export default router;
