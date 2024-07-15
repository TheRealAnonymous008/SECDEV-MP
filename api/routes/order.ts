import express = require('express');
import controller from '../controllers/order';
import { ALL_ROLES, RoleIds, Roles } from '../models/enum';
import validateRole from '../middleware/roleValidation';
import validateToken from '../middleware/authValidation';

const router = express.Router();

router.get('/all', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT, RoleIds.VIEW]), controller.all);
router.get('/id', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT, RoleIds.VIEW]), controller.id);

router.post('/create', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), controller.create);
router.post('/update', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), controller.update);
router.delete('/delete', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), controller.remove);
//router.get('/filter', validateToken, validateRole(ALL_ROLES), controller.filter);
//router.post('/verify', validateToken, validateRole([Roles.ADMIN]), controller.verify);

export default router;