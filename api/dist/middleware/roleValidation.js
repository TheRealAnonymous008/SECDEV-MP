"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../repository/user");
const validateRole = (allowedRoles) => {
    return (req, res, next) => {
        req.session.reload((err) => { console.log(err); });
        if (req.session["uid"] == null) {
            console.log("Error");
        }
        else {
            user_1.UserRepository.retrieveById(req.session["uid"])
                .then((user) => {
                if (allowedRoles.includes(user.Role)) {
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
                res.status(500).end();
            });
        }
    };
};
exports.default = validateRole;
