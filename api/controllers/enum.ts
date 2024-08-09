import express = require('express');
import { RoleEnumRepository, StatusEnumRepository, TypeEnumRepository } from '../repository/enums';
import { validateInteger, validateWord, validateRequired, validateOptional, baseValidation } from '../middleware/inputValidation'; 
import { getEnumNames } from '../models/enums';
import logger from '../utils/logger';
import { LogLevel } from '../config/logConfig';

const getAllRoles = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    RoleEnumRepository.retrieveAll()
        .then((result) => {
            res.json(getEnumNames(result));
            logger.log(LogLevel.AUDIT, `Retrieved all roles`);
            res.status(200).end();
        })
        .catch((err) => {
            logger.log(LogLevel.ERRORS, `Error retrieving all roles: ${err.message}`);
            next(err);
        });
};

const getRoleByName = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let name = validateRequired(req.query.name.toString(), validateWord);
        RoleEnumRepository.retrieveByName(name)
            .then((result) => {
                if (!result){
                    logger.log(LogLevel.DEBUG, `Role not found: ${name}`);
                    res.status(404).end();
                    return;
                }
                res.json(result);
                logger.log(LogLevel.AUDIT, `Role retrieved: ${name}`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error retrieving role by name ${name}: ${err.message}`);
                next(err);
            });
    } catch (error) {
        logger.log(LogLevel.ERRORS, `Validation error in getRoleByName function: ${error.message}`);
        next(error);
    }
};

const getAllStatuses = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    StatusEnumRepository.retrieveAll()
        .then((result) => {
            res.json(getEnumNames(result));
            logger.log(LogLevel.AUDIT, `Retrieved all statuses`);
            res.status(200).end();
        })
        .catch((err) => {
            logger.log(LogLevel.ERRORS, `Error retrieving all statuses: ${err.message}`);
            next(err);
        });
};

const getStatusByName = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let name = validateRequired(req.query.name.toString(), validateWord);
        StatusEnumRepository.retrieveByName(name)
            .then((result) => {
                if (!result){
                    logger.log(LogLevel.DEBUG, `Status not found: ${name}`);
                    res.status(404).end();
                    return;
                }
                res.json(result);
                logger.log(LogLevel.AUDIT, `Status retrieved: ${name}`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error retrieving status by name ${name}: ${err.message}`);
                next(err);
            });
    } catch (error) {
        logger.log(LogLevel.ERRORS, `Validation error in getStatusByName function: ${error.message}`);
        next(error);
    }
};

const getAllTypes = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    TypeEnumRepository.retrieveAll()
        .then((result) => {
            res.json(getEnumNames(result));
            logger.log(LogLevel.AUDIT, `Retrieved all types`);
            res.status(200).end();
        })
        .catch((err) => {
            logger.log(LogLevel.ERRORS, `Error retrieving all types: ${err.message}`);
            next(err);
        });
};

const getTypeByName = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let name = validateRequired(req.query.name.toString(), validateWord);
        TypeEnumRepository.retrieveByName(name)
            .then((result) => {
                if (!result){
                    logger.log(LogLevel.DEBUG, `Type not found: ${name}`);
                    res.status(404).end();
                    return;
                }
                res.json(result);
                logger.log(LogLevel.AUDIT, `Type retrieved: ${name}`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error retrieving type by name ${name}: ${err.message}`);
                next(err);
            });
    } catch (error) {
        logger.log(LogLevel.ERRORS, `Validation error in getTypeByName function: ${error.message}`);
        next(error);
    }
};

export default {getAllRoles, getRoleByName, getAllStatuses, getStatusByName, getAllTypes, getTypeByName};
