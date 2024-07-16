import express = require('express');
import { RoleEnumRepository, StatusEnumRepository, TypeEnumRepository } from '../repository/enums';
import { validateInteger, validateWord } from '../middleware/inputValidation'; 
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

const getRoleByName = (req: express.Request, res: express.Response) => {
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

const getStatusByName = (req: express.Request, res: express.Response) => {
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

const getTypeByName = (req: express.Request, res: express.Response) => {
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
                console.log(err);
                res.status(500).end();
            });
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}

export default {getAllRoles, getRoleByName, getAllStatuses, getStatusByName, getAllTypes, getTypeByName};
