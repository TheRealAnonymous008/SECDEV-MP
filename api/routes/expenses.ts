import express = require('express');
import expensesController from '../controllers/expenses';
import validateRole from '../middleware/roleValidation';
import validateToken from '../middleware/authValidation';
import { RoleIds } from '../models/enum';

const router = express.Router();

router.get('/all', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT, RoleIds.VIEW]), expensesController.all);
router.get('/id', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT, RoleIds.VIEW]), expensesController.id);
router.post('/create', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), expensesController.create);
router.post('/update', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), expensesController.update);
router.delete('/delete', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT]), expensesController.remove);

// router.get('/filter', validateToken, validateRole([RoleIds.ADMIN, RoleIds.VIEW_EDIT, RoleIds.VIEW]), expensesController.filter);

export default router;
