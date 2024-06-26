import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repository/user";

const validateRole = (allowedRoles : number[]) => {
    return (req : Request, res : Response, next : NextFunction) => {
        req.session.reload((err) => {console.log(err)})
        
        if (req.session["uid"] == null){
            console.log("Error")
        } else {
            UserRepository.retrieveById(req.session["uid"])
            .then((user) => {
                if (allowedRoles.includes(user.Role)){
                    next();
                }
                else {
                    res.status(403).json({
                        message: 'You do not have permission to access this function'
                    })
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).end();
            })
        }
    }
}

export default validateRole;