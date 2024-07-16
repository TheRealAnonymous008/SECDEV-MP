import express = require('express');
import { RoleEnumRepository, StatusEnumRepository, TypeEnumRepository } from '../repository/enums';
import { validateInteger } from '../middleware/inputValidation'; 
import { getEnumNames } from '../models/enums';

const getAllRoles = (req: express.Request, res: express.Response) => {
    RoleEnumRepository.retrieveAll()
        .then((result) => {
            res.json(getEnumNames(result));
            res.status(200).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
};

const getRoleById = (req: express.Request, res: express.Response) => {
    try {
        let id = validateInteger(req.query.id.toString());
        RoleEnumRepository.retrieveById(id)
            .then((result) => {
                if (!result){
                    res.status(404).end();
                    return;
                }
                res.json(result);
                res.status(200).end();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).end();
            });
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
};

const getAllStatuses = (req: express.Request, res: express.Response) => {
    StatusEnumRepository.retrieveAll()
        .then((result) => {
            res.json(getEnumNames(result));
            res.status(200).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
};

const getStatusById = (req: express.Request, res: express.Response) => {
    try {
        let id = validateInteger(req.query.id.toString());
        StatusEnumRepository.retrieveById(id)
            .then((result) => {
                if (!result){
                    res.status(404).end();
                    return;
                }
                res.json(result);
                res.status(200).end();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).end();
            });
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
};

const getAllTypes = (req: express.Request, res: express.Response) => {
    TypeEnumRepository.retrieveAll()
        .then((result) => {
            res.json(getEnumNames(result));
            res.status(200).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
}

const getTypeById = (req: express.Request, res: express.Response) => {
    try {
        let id = validateInteger(req.query.id.toString());
        TypeEnumRepository.retrieveById(id)
            .then((result) => {
                if (!result){
                    res.status(404).end();
                    return;
                }
                res.json(result);
                res.status(200).end();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).end();
            });
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}

export default {getAllRoles, getRoleById, getAllStatuses, getStatusById, getAllTypes, getTypeById};
