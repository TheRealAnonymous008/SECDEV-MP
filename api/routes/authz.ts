import express = require('express');
import controller from "../controllers/authz";
import * as inputValidation from '../middleware/inputValidation';
const router = express.Router();

function validateRequestBody(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        try {
            inputValidation.validateRegistrationInput(
                req.body.firstName, 
                req.body.lastName, 
                req.body.username, 
                req.body.password, 
                req.body.mobileNumber, 
                req.body.email
            );
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
}

router.get('/verify', controller.verify)
router.post('/register', validateRequestBody, controller.register) 
router.post('/login', controller.login)       
router.post('/logout', controller.logout)

export default router;