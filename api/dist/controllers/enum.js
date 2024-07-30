"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../repository/enums");
const inputValidation_1 = require("../middleware/inputValidation");
const enums_2 = require("../models/enums");
const getAllRoles = (req, res, next) => {
    enums_1.RoleEnumRepository.retrieveAll()
        .then((result) => {
        res.json((0, enums_2.getEnumNames)(result));
        res.status(200).end();
    })
        .catch((err) => {
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
            next(err);
        });
    }
    catch (error) {
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
            next(err);
        });
    }
    catch (error) {
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
            next(err);
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = { getAllRoles, getRoleByName, getAllStatuses, getStatusByName, getAllTypes, getTypeByName };
