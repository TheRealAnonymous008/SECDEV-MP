import  express = require('express');
import { makeVehicleArrayView, makeVehicleView } from '../projections/vehicle';
import { VehicleQuery, VehicleRepository } from '../repository/vehicle';
import { VehicleRow } from '../models/vehicle';
import { baseValidation, validateInteger, validateLicensePlate, validateLimit, validateWord, validateRequired, validateOptional } from '../middleware/inputValidation';
import logger from '../utils/logger';
import { LogLevel } from '../config/logConfig';

const all = (req: express.Request, res: express.Response, next : express.NextFunction) => {
    VehicleRepository.retrieveAll()
    .then((result) => {
        res.json({
            data: makeVehicleArrayView(result),
            count : result.length 
        });
        res.status(200).end();
        logger.log(LogLevel.AUDIT, `Retrieved all vehicles`);
    })
    .catch((err) => {
        logger.log(LogLevel.ERRORS, `Error retrieving all vehicles: ${err.message}`);
        next(err)
    })
}

const id = (req: express.Request, res: express.Response, next : express.NextFunction) => {
    try {
        let id = validateRequired(req.query.id.toString(), validateInteger)
        VehicleRepository.retrieveById(id)
        .then((result) => {
            if (result.length == 0){
                res.status(404).end();
                logger.log(LogLevel.DEBUG, `Vehicle not found: ${id}`);
                return
            }
            res.json(makeVehicleView(result));
            res.status(200).end();
            logger.log(LogLevel.AUDIT, `Vehicle retrieved: ${id}`);
        })
        .catch((err) => {
            logger.log(LogLevel.ERRORS, `Error retrieving vehicle by id: ${err.message}`);
            next(err)
        })
    } catch (error) {
        logger.log(LogLevel.ERRORS, `Error retrieving vehicle by id: ${error.message}`);
        next(error)
    }
}

const create = (req: express.Request, res: express.Response, next : express.NextFunction) => {
    try {
        const vehicle : VehicleRow = {
            LicensePlate: validateRequired(req.body.licensePlate, validateLicensePlate),
            Model: validateRequired(req.body.model, validateWord),
            Manufacturer: validateRequired(req.body.manufacturer, validateWord),
            YearManufactured: validateRequired(req.body.yearManufactured, validateInteger),
            Color: validateRequired(req.body.color, validateWord),
            Engine: validateRequired(req.body.engine, validateWord),
            Remarks: validateOptional(req.body.remarks, baseValidation)
        };
        
        VehicleRepository.insert(vehicle)
            .then((result) => {
                if (result == undefined){
                    logger.log(LogLevel.ERRORS, `Failed to create vehicles with params ${vehicle}`);
                    throw new Error(`Failed to create vehicles with params ${vehicle}`)
                }
                res.json(makeVehicleView({...vehicle, id: result}));
                res.status(200).end();
                logger.log(LogLevel.AUDIT, `Vehicle created: ${result}`);
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error creating vehicle: ${err.message}`);
                next(err)
            })
    } catch (error) {
        logger.log(LogLevel.ERRORS, `Error creating vehicle: ${error.message}`);
        next(error)
    }
}

const update = (req: express.Request, res: express.Response, next : express.NextFunction) => {
    try {
        const vehicle : VehicleRow = {
            LicensePlate: validateRequired(req.body.licensePlate, validateLicensePlate),
            Model: validateRequired(req.body.model, validateWord),
            Manufacturer: validateRequired(req.body.manufacturer, validateWord),
            YearManufactured: validateRequired(req.body.yearManufactured, validateInteger),
            Color: validateRequired(req.body.color, validateWord),
            Engine: validateRequired(req.body.engine, validateWord),
            Remarks: validateOptional(req.body.remarks, baseValidation)
        };
        let id = validateRequired(req.query.id.toString(), validateInteger)

        VehicleRepository.update(id, vehicle)
            .then((result) => {
                if (result == undefined){
                    logger.log(LogLevel.ERRORS, `Failed to update vehicle with id ${id}`);
                    throw new Error(`Failed to update vehicle with id ${id}`)
                }
                res.json(makeVehicleView({...vehicle, id: result}));
                res.status(200).end();
                logger.log(LogLevel.AUDIT, `Vehicle updated: ${result}`);
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error updating vehicle with id ${id}: ${err.message}`);
                next(err)
            })
    } catch (error) {
        logger.log(LogLevel.ERRORS, `Error in update function with ${id}: ${error.message}`);
        next(error)
    }
}

const remove = (req: express.Request, res: express.Response, next : express.NextFunction) => {
    try {
        let id = validateRequired(req.query.id.toString(), validateInteger)
        VehicleRepository.delete(id)
            .then((result) => {
                if (result == undefined){
                    logger.log(LogLevel.ERRORS, `Failed to delete vehicle with id ${id}`);
                    throw new Error(`Failed to delete vehicle with id ${id}`)
                }
                res.status(200).end();
                logger.log(LogLevel.AUDIT, `Vehicle deleted: ${id}`);
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error deleting vehicle with id ${id}: ${err.message}`);
                next(err)
            })
    } catch (error) {
        logger.log(LogLevel.ERRORS, `Error in remove function with ${id}: ${error.message}`);
        next(error)
    }
}

const filter = (req: express.Request, res: express.Response, next : express.NextFunction) => {
    try {
        const query = makeQuery(req)
        VehicleRepository.filter(query)
            .then((result) => {
                res.json({
                    data: makeVehicleArrayView(result),
                    count : result.length 
                });
                res.status(200).end();
                logger.log(LogLevel.AUDIT, `Filtered vehicles`);
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error filtering vehicles: ${err.message}`);
                next(err)
            })
    }
    catch (err) {
        logger.log(LogLevel.ERRORS, `Error in filter function: ${err.message}`);
        next(err)
    }
}


const makeQuery = (req : express.Request) : VehicleQuery => {
    const licensePlate = validateOptional(req.query.licensePlate, baseValidation)
    const model = validateOptional(req.query.model, baseValidation)
    const manufacturer = validateOptional(req.query.manufacturer, baseValidation)
    const yearManufactured = validateOptional(req.query.yearManufactured, baseValidation)
    const color = validateOptional(req.query.color, baseValidation)
    const engine = validateOptional(req.query.engine, baseValidation)
    const remarks = validateOptional(req.query.remarks, baseValidation)
    const limit = validateOptional(req.query.limit, validateLimit)
    const skip = validateOptional(req.query.skip, baseValidation)

    return {
        licensePlate: (licensePlate) ? (licensePlate as string) : null,
        model: (model) ? (model as string) : null,
        manufacturer: (manufacturer) ? (manufacturer as string) : null,
        yearManufactured: (yearManufactured) ? (yearManufactured as number) : null,
        color: (color) ? (color as string) : null,
        engine: (engine) ? (engine as string) : null,
        remarks: (remarks) ? (remarks as string) : null,
        limit: (limit) ? (limit as number) : null,
        skip: (skip) ? (skip as number) : null,
    }
}

export default {all, id, create, update, remove, filter};