import  express = require('express');
import { makeVehicleArrayView, makeVehicleView } from '../projections/vehicle';
import { VehicleQuery, VehicleRepository } from '../repository/vehicle';
import { VehicleRow } from '../models/vehicle';
import { baseValidation, validateInteger, validateLicensePlate, validateLimit, validateWord, validateRequired, validateOptional } from '../middleware/inputValidation';

const all = (req: express.Request, res: express.Response, next : express.NextFunction) => {
    VehicleRepository.retrieveAll()
    .then((result) => {
        res.json({
            data: makeVehicleArrayView(result),
            count : result.length 
        });
        res.status(200).end();
    })
    .catch((err) => {
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
                return
            }
            res.json(makeVehicleView(result));
            res.status(200).end();
        })
        .catch((err) => {
            next(err)
        })
    } catch (error) {
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
                    throw new Error(`Failed to create vehicles with params ${vehicle}`)
                }
                res.json(makeVehicleView({...vehicle, id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            })
    } catch (error) {
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
                    throw new Error(`Failed to update vehicle with id ${id}`)
                }
                res.json(makeVehicleView({...vehicle, id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            })
    } catch (error) {
        next(error)
    }
}

const remove = (req: express.Request, res: express.Response, next : express.NextFunction) => {
    try {
        let id = validateRequired(req.query.id.toString(), validateInteger)
        VehicleRepository.delete(id)
            .then((result) => {
                if (result == undefined){
                    throw new Error(`Failed to delete vehicle with id ${id}`)
                }
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            })
    } catch (error) {
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
            })
            .catch((err) => {
                next(err)
            })
    }
    catch (err) {
        next(err)
    }
}


const makeQuery = (req : express.Request) : VehicleQuery => {
    const licensePlate = validateRequired(req.query.licensePlate, baseValidation)
    const model = validateRequired(req.query.model, baseValidation)
    const manufacturer = validateRequired(req.query.manufacturer, baseValidation)
    const yearManufactured = validateRequired(req.query.yearManufactured, baseValidation)
    const color = validateRequired(req.query.color, baseValidation)
    const engine = validateRequired(req.query.engine, baseValidation)
    const remarks = validateOptional(req.query.remarks, baseValidation)
    const limit = validateRequired(req.query.limit, validateLimit)
    const skip = validateRequired(req.query.skip, baseValidation)

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