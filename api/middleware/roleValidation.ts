import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repository/user";

const validateRole = (allowedRoles : number[]) => {
    return (req : Request, res : Response, next : NextFunction) => {
        const sessionId = res.locals.jwt.id
        
        UserRepository.getUserFromSession(sessionId)
            .then((user) =>{
                if (user == undefined) {
                    return 
                }
                else if (allowedRoles.includes(user.Role)){
                    next()
                }
                else {
                    res.status(403).json({
                        message: 'You do not have permission to access this function'
                    });
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(403).json({
                    message: 'You do not have permission to access this function'
                });
            })
    }
}

export default validateRole;