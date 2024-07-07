import express = require('express');
import controller from "../controllers/authz";
import validateToken from '../middleware/authValidation';
import { limiter } from '../config/limiterConfig';

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/handshake', limiter, validateToken, controller.handshake)
router.post('/register', limiter, controller.register) 
router.post('/login', limiter, controller.login)       
router.post('/logout', controller.logout)

export default router;