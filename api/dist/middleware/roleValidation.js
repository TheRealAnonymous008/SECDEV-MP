"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../repository/user");
const authConfig_1 = require("../config/authConfig");
const validateRole = (allowedRoles) => {
    return (req, res, next) => {
        const sessionId = res.locals.jwt.id;
        const csrf = req.cookies.csrf;
        user_1.UserRepository.getUserFromSession(sessionId, csrf)
            .then((user) => {
            if (user == undefined) {
                return;
            }
            else if (allowedRoles.includes(user.Role)) {
                // After this refresh the csrf token for non-view requests
                if (req.method != "GET") {
                    user_1.UserRepository.refreshCSRF(sessionId)
                        .then((csrf) => {
                        res.cookie('csrf', csrf, authConfig_1.COOKIE_SETTINGS);
                        next();
                    })
                        .catch((err) => {
                        console.log(err);
                        res.status(500);
                    });
                }
                else {
                    next();
                }
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
