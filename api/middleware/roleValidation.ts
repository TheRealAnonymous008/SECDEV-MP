import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repository/user";
import { COOKIE_SETTINGS } from "../config/authConfig";
import { validateRequired, baseValidation } from "./inputValidation";

const validateRole = (allowedRoles : number[]) => {
    return (req : Request, res : Response, next : NextFunction) => {
        const sessionId = validateRequired(res.locals.jwt.id, baseValidation);
        const csrf = validateRequired(req.cookies.csrf, baseValidation);
        
        UserRepository.getUserFromSession(sessionId, csrf)
            .then((user) =>{
                if (user == undefined) {
                    res.status(401).json({
                        message: "No session"
                    })
                    res.end()
                }
                else if (allowedRoles.includes(user.Role)){
                    // After this refresh the csrf token for non-view requests
                    if (req.method != "GET") {
                        UserRepository.refreshCSRF(sessionId)
                            .then((csrf) => {
                                res.cookie('csrf', csrf, COOKIE_SETTINGS);
                                next()
                            })
                            .catch((err) => {
                                throw err;
                            })
                    } else {
                        next()
                    }
                }
                else {
                    res.status(403).json({
                        message: 'You do not have permission to access this function'
                    });
                }
            })
            .catch((err) => {
                // TODO: Possibly change this
                console.log(err)
                res.status(403).json({
                    message: 'You do not have permission to access this function'
                });
            })
    }

}

export default validateRole;