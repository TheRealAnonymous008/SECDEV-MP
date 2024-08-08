import express = require('express');
import controller from '../controllers/complaints';
import validateRole from '../middleware/roleValidation';
import validateToken from '../middleware/authValidation';
import { RoleIds } from '../models/enum';

const router = express.Router();

router.get('/all', validateToken, validateRole([RoleIds.ADMIN]), controller.all);
router.get('/id', validateToken, validateRole([RoleIds.ADMIN]), controller.id);
router.post('/create', validateToken, validateRole([RoleIds.ADMIN]), controller.create);
router.delete('/delete', validateToken, validateRole([RoleIds.ADMIN]), controller.remove)
router.get('/filter', validateToken, validateRole([RoleIds.ADMIN]), controller.filter);

export default router;