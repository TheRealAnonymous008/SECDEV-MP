"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../repository/enums");
const inputValidation_1 = require("../middleware/inputValidation");
const enums_2 = require("../models/enums");
const getAllRoles = (req, res) => {
    enums_1.RoleEnumRepository.retrieveAll()
        .then((result) => {
        res.json((0, enums_2.getEnumNames)(result));
        res.status(200).end();
    })
        .catch((err) => {
        console.log(err);
        res.status(500).end();
    });
};
const getRoleByName = (req, res) => {
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
            console.log(err);
            res.status(500).end();
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).end();
    }
};
const getAllStatuses = (req, res) => {
    enums_1.StatusEnumRepository.retrieveAll()
        .then((result) => {
        res.json((0, enums_2.getEnumNames)(result));
        res.status(200).end();
    })
        .catch((err) => {
        console.log(err);
        res.status(500).end();
    });
};
const getStatusByName = (req, res) => {
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
            console.log(err);
            res.status(500).end();
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).end();
    }
};
const getAllTypes = (req, res) => {
    enums_1.TypeEnumRepository.retrieveAll()
        .then((result) => {
        res.json((0, enums_2.getEnumNames)(result));
        res.status(200).end();
    })
        .catch((err) => {
        console.log(err);
        res.status(500).end();
    });
};
const getTypeByName = (req, res) => {
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
            console.log(err);
            res.status(500).end();
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).end();
    }
};
exports.default = { getAllRoles, getRoleByName, getAllStatuses, getStatusByName, getAllTypes, getTypeByName };
