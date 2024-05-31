import express = require('express');
import controller from '../controllers/initialize'
import validateRole from '../middleware/roleValidation';
import validateToken from '../middleware/authValidation';

const router = express.Router();

router.get('/', controller.initialize)

export default router;

