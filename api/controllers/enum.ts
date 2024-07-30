import express = require('express');
import { RoleEnumRepository, StatusEnumRepository, TypeEnumRepository } from '../repository/enums';
import { validateInteger, validateWord } from '../middleware/inputValidation'; 
import { getEnumNames } from '../models/enums';

const getAllRoles = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    RoleEnumRepository.retrieveAll()
        .then((result) => {
            res.json(getEnumNames(result));
            res.status(200).end();
        })
        .catch((err) => {
            next(err)
        });
};

const getRoleByName = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let name = validateWord(req.query.name.toString());
        RoleEnumRepository.retrieveByName(name)
            .then((result) => {
                if (!result){
                    res.status(404).end();
                    return;
                }
                res.json(result);
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            });
    } catch (error) {
        next(error)
    }
};

const getAllStatuses = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    StatusEnumRepository.retrieveAll()
        .then((result) => {
            res.json(getEnumNames(result));
            res.status(200).end();
        })
        .catch((err) => {
            next(err)
        });
};

const getStatusByName = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let name = validateWord(req.query.name.toString());
        StatusEnumRepository.retrieveByName(name)
            .then((result) => {
                if (!result){
                    res.status(404).end();
                    return;
                }
                res.json(result);
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            });
    } catch (error) {
        next(error)
    }
};

const getAllTypes = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    TypeEnumRepository.retrieveAll()
        .then((result) => {
            res.json(getEnumNames(result));
            res.status(200).end();
        })
        .catch((err) => {
            next(err)
        });
}

const getTypeByName = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let name = validateWord(req.query.name.toString());
        TypeEnumRepository.retrieveByName(name)
            .then((result) => {
                if (!result){
                    res.status(404).end();
                    return;
                }
                res.json(result);
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            });
    } catch (error) {
        next(error)
    }
}

export default {getAllRoles, getRoleByName, getAllStatuses, getStatusByName, getAllTypes, getTypeByName};
