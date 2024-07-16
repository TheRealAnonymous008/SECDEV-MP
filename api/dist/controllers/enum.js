"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../repository/enums");
const inputValidation_1 = require("../middleware/inputValidation");
const getAllRoles = (req, res) => {
    enums_1.RoleEnumRepository.retrieveAll()
        .then((result) => {
        res.json(result);
        res.status(200).end();
    })
        .catch((err) => {
        console.log(err);
        res.status(500).end();
    });
};
const getRoleById = (req, res) => {
    try {
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        enums_1.RoleEnumRepository.retrieveById(id)
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
        res.json(result);
        res.status(200).end();
    })
        .catch((err) => {
        console.log(err);
        res.status(500).end();
    });
};
const getStatusById = (req, res) => {
    try {
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        enums_1.StatusEnumRepository.retrieveById(id)
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
        res.json(result);
        res.status(200).end();
    })
        .catch((err) => {
        console.log(err);
        res.status(500).end();
    });
};
const getTypeById = (req, res) => {
    try {
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        enums_1.TypeEnumRepository.retrieveById(id)
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
exports.default = { getAllRoles, getRoleById, getAllStatuses, getStatusById, getAllTypes, getTypeById };
