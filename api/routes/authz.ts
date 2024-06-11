import express = require('express');
import controller from "../controllers/authz";
import * as inputValidation from '../middleware/inputValidation';
const router = express.Router();
import { rateLimit } from 'express-rate-limit';
import validateToken from '../middleware/authValidation';

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Rate limiter for login capping
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute window
	limit: 10, // Limit each IP to 10 requests per `window`
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
	message: "Too many requests. Try again later",
});


router.get('/handshake', validateToken, controller.handshake)
router.post('/register', controller.register) 
router.post('/login', limiter, controller.login)       
router.post('/logout', controller.logout)

export default router;