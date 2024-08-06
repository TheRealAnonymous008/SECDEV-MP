"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../repository/enums");
const inputValidation_1 = require("../middleware/inputValidation");
const enums_2 = require("../models/enums");
const logger_1 = __importDefault(require("../utils/logger"));
const logConfig_1 = require("../config/logConfig");
const getAllRoles = (req, res, next) => {
    enums_1.RoleEnumRepository.retrieveAll()
        .then((result) => {
        res.json((0, enums_2.getEnumNames)(result));
        res.status(200).end();
    })
        .catch((err) => {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving all roles: ${err.message}`);
        next(err);
    });
};
const getRoleByName = (req, res, next) => {
    try {
        let name = (0, inputValidation_1.validateWord)(req.query.name.toString());
        enums_1.RoleEnumRepository.retrieveByName(name)
            .then((result) => {
            if (!result) {
                res.status(404).end();
                return;
            }
            res.json(result);
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving role by name ${name}: ${err.message}`);
            next(err);
        });
    }
    catch (error) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Validation error in getRoleByName function: ${error.message}`);
        next(error);
    }
};
const getAllStatuses = (req, res, next) => {
    enums_1.StatusEnumRepository.retrieveAll()
        .then((result) => {
        res.json((0, enums_2.getEnumNames)(result));
        res.status(200).end();
    })
        .catch((err) => {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving all statuses: ${err.message}`);
        next(err);
    });
};
const getStatusByName = (req, res, next) => {
    try {
        let name = (0, inputValidation_1.validateWord)(req.query.name.toString());
        enums_1.StatusEnumRepository.retrieveByName(name)
            .then((result) => {
            if (!result) {
                res.status(404).end();
                return;
            }
            res.json(result);
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving status by name ${name}: ${err.message}`);
            next(err);
        });
    }
    catch (error) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Validation error in getStatusByName function: ${error.message}`);
        next(error);
    }
};
const getAllTypes = (req, res, next) => {
    enums_1.TypeEnumRepository.retrieveAll()
        .then((result) => {
        res.json((0, enums_2.getEnumNames)(result));
        res.status(200).end();
    })
        .catch((err) => {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving all types: ${err.message}`);
        next(err);
    });
};
const getTypeByName = (req, res, next) => {
    try {
        let name = (0, inputValidation_1.validateWord)(req.query.name.toString());
        enums_1.TypeEnumRepository.retrieveByName(name)
            .then((result) => {
            if (!result) {
                res.status(404).end();
                return;
            }
            res.json(result);
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving type by name ${name}: ${err.message}`);
            next(err);
        });
    }
    catch (error) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Validation error in getTypeByName function: ${error.message}`);
        next(error);
    }
};
exports.default = { getAllRoles, getRoleByName, getAllStatuses, getStatusByName, getAllTypes, getTypeByName };
