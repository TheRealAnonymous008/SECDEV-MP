import { NextFunction, Request, Response } from "express";

const validateRole = (allowedRoles : string[]) => {
    // TODO: This is temporary, Replace after debugging
    return (req : Request, res : Response, next : NextFunction) => {
        next();
    }

    return (req : Request, res : Response, next : NextFunction) => {
        if(allowedRoles.includes(res.locals.jwt.role))
            next();
        else {
            res.status(403).json({
                message: 'You do not have permission to access this function'
            });
        }
    }
}

export default validateRole;