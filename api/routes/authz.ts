import express = require('express');
import controller from "../controllers/authz";
const router = express.Router();

router.get('/verify', controller.verify)
router.post('/register', controller.register) 
router.post('/login', controller.login)       
router.post('/logout', controller.logout)

export default router;