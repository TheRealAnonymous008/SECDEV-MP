"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vehicle_1 = require("../projections/vehicle");
const vehicle_2 = require("../repository/vehicle");
const inputValidation_1 = require("../middleware/inputValidation");
const logger_1 = __importDefault(require("../utils/logger"));
const logConfig_1 = require("../config/logConfig");
const all = (req, res, next) => {
    vehicle_2.VehicleRepository.retrieveAll()
        .then((result) => {
        res.json({
            data: (0, vehicle_1.makeVehicleArrayView)(result),
            count: result.length
        });
        res.status(200).end();
        logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Retrieved all vehicles`);
    })
        .catch((err) => {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving all vehicles: ${err.message}`);
        next(err);
    });
};
const id = (req, res, next) => {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        vehicle_2.VehicleRepository.retrieveById(id)
            .then((result) => {
            if (result.length == 0) {
                res.status(404).end();
                logger_1.default.log(logConfig_1.LogLevel.DEBUG, `Vehicle not found: ${id}`);
                return;
            }
            res.json((0, vehicle_1.makeVehicleView)(result));
            res.status(200).end();
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Vehicle retrieved: ${id}`);
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving vehicle by id: ${err.message}`);
            next(err);
        });
    }
    catch (error) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving vehicle by id: ${error.message}`);
        next(error);
    }
};
const create = (req, res, next) => {
    try {
        const vehicle = {
            LicensePlate: (0, inputValidation_1.validateRequired)(req.body.licensePlate, inputValidation_1.validateLicensePlate),
            Model: (0, inputValidation_1.validateRequired)(req.body.model, inputValidation_1.validateWord),
            Manufacturer: (0, inputValidation_1.validateRequired)(req.body.manufacturer, inputValidation_1.validateWord),
            YearManufactured: (0, inputValidation_1.validateRequired)(req.body.yearManufactured, inputValidation_1.validateInteger),
            Color: (0, inputValidation_1.validateRequired)(req.body.color, inputValidation_1.validateWord),
            Engine: (0, inputValidation_1.validateRequired)(req.body.engine, inputValidation_1.validateWord),
            Remarks: (0, inputValidation_1.validateOptional)(req.body.remarks, inputValidation_1.baseValidation)
        };
        vehicle_2.VehicleRepository.insert(vehicle)
            .then((result) => {
            if (result == undefined) {
                logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Failed to create vehicles with params ${vehicle}`);
                throw new Error(`Failed to create vehicles with params ${vehicle}`);
            }
            res.json((0, vehicle_1.makeVehicleView)(Object.assign(Object.assign({}, vehicle), { id: result })));
            res.status(200).end();
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Vehicle created: ${result}`);
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error creating vehicle: ${err.message}`);
            next(err);
        });
    }
    catch (error) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error creating vehicle: ${error.message}`);
        next(error);
    }
};
const update = (req, res, next) => {
    try {
        const vehicle = {
            LicensePlate: (0, inputValidation_1.validateRequired)(req.body.licensePlate, inputValidation_1.validateLicensePlate),
            Model: (0, inputValidation_1.validateRequired)(req.body.model, inputValidation_1.validateWord),
            Manufacturer: (0, inputValidation_1.validateRequired)(req.body.manufacturer, inputValidation_1.validateWord),
            YearManufactured: (0, inputValidation_1.validateRequired)(req.body.yearManufactured, inputValidation_1.validateInteger),
            Color: (0, inputValidation_1.validateRequired)(req.body.color, inputValidation_1.validateWord),
            Engine: (0, inputValidation_1.validateRequired)(req.body.engine, inputValidation_1.validateWord),
            Remarks: (0, inputValidation_1.validateOptional)(req.body.remarks, inputValidation_1.baseValidation)
        };
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        vehicle_2.VehicleRepository.update(id, vehicle)
            .then((result) => {
            if (result == undefined) {
                logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Failed to update vehicle with id ${id}`);
                throw new Error(`Failed to update vehicle with id ${id}`);
            }
            res.json((0, vehicle_1.makeVehicleView)(Object.assign(Object.assign({}, vehicle), { id: result })));
            res.status(200).end();
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Vehicle updated: ${result}`);
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error updating vehicle with id ${id}: ${err.message}`);
            next(err);
        });
    }
    catch (error) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in update function with ${id}: ${error.message}`);
        next(error);
    }
};
const remove = (req, res, next) => {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        vehicle_2.VehicleRepository.delete(id)
            .then((result) => {
            if (result == undefined) {
                logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Failed to delete vehicle with id ${id}`);
                throw new Error(`Failed to delete vehicle with id ${id}`);
            }
            res.status(200).end();
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Vehicle deleted: ${id}`);
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error deleting vehicle with id ${id}: ${err.message}`);
            next(err);
        });
    }
    catch (error) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in remove function with ${id}: ${error.message}`);
        next(error);
    }
};
const filter = (req, res, next) => {
    try {
        const query = makeQuery(req);
        vehicle_2.VehicleRepository.filter(query)
            .then((result) => {
            res.json({
                data: (0, vehicle_1.makeVehicleArrayView)(result),
                count: result.length
            });
            res.status(200).end();
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Filtered vehicles`);
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error filtering vehicles: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in filter function: ${err.message}`);
        next(err);
    }
};
const makeQuery = (req) => {
    const licensePlate = (0, inputValidation_1.validateOptional)(req.query.licensePlate, inputValidation_1.baseValidation);
    const model = (0, inputValidation_1.validateOptional)(req.query.model, inputValidation_1.baseValidation);
    const manufacturer = (0, inputValidation_1.validateOptional)(req.query.manufacturer, inputValidation_1.baseValidation);
    const yearManufactured = (0, inputValidation_1.validateOptional)(req.query.yearManufactured, inputValidation_1.baseValidation);
    const color = (0, inputValidation_1.validateOptional)(req.query.color, inputValidation_1.baseValidation);
    const engine = (0, inputValidation_1.validateOptional)(req.query.engine, inputValidation_1.baseValidation);
    const remarks = (0, inputValidation_1.validateOptional)(req.query.remarks, inputValidation_1.baseValidation);
    const limit = (0, inputValidation_1.validateOptional)(req.query.limit, inputValidation_1.validateLimit);
    const skip = (0, inputValidation_1.validateOptional)(req.query.skip, inputValidation_1.baseValidation);
    return {
        licensePlate: (licensePlate) ? licensePlate : null,
        model: (model) ? model : null,
        manufacturer: (manufacturer) ? manufacturer : null,
        yearManufactured: (yearManufactured) ? yearManufactured : null,
        color: (color) ? color : null,
        engine: (engine) ? engine : null,
        remarks: (remarks) ? remarks : null,
        limit: (limit) ? limit : null,
        skip: (skip) ? skip : null,
    };
};
exports.default = { all, id, create, update, remove, filter };
