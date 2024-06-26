"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../repository/user");
const validateRole = (allowedRoles) => {
    return (req, res, next) => {
        const sessionId = res.locals.jwt.id;
        user_1.UserRepository.getUserFromSession(sessionId)
            .then((user) => {
            if (user == undefined) {
                return;
            }
            else if (allowedRoles.includes(user.Role)) {
                next();
            }
            else {
                res.status(403).json({
                    message: 'You do not have permission to access this function'
                });
            }
        })
            .catch((err) => {
            console.log(err);
            res.status(403).json({
                message: 'You do not have permission to access this function'
            });
        });
    };
};
exports.default = validateRole;
