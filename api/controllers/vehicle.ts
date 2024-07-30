import  express = require('express');
import { makeVehicleArrayView, makeVehicleView } from '../projections/vehicle';
import { VehicleQuery, VehicleRepository } from '../repository/vehicle';
import { VehicleRow } from '../models/vehicle';
import { baseValidation, validateInteger, validateLicensePlate, validateLimit, validateWord } from '../middleware/inputValidation';

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
        let id = validateInteger(req.query.id.toString())
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
            LicensePlate: validateLicensePlate(req.body.licensePlate),
            Model: validateWord(req.body.model),
            Manufacturer: validateWord(req.body.manufacturer),
            YearManufactured: validateInteger(req.body.yearManufactured),
            Color: validateWord(req.body.color),
            Engine: validateWord(req.body.engine),
            Remarks: baseValidation(req.body.remarks)
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
            LicensePlate: validateLicensePlate(req.body.licensePlate),
            Model: validateWord(req.body.model),
            Manufacturer: validateWord(req.body.manufacturer),
            YearManufactured: validateInteger(req.body.yearManufactured),
            Color: validateWord(req.body.color),
            Engine: validateWord(req.body.engine),
            Remarks: baseValidation(req.body.remarks)
        };
        let id = validateInteger(req.query.id.toString())

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
        let id = validateInteger(req.query.id.toString())
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
    const licensePlate = baseValidation(req.query.licensePlate)
    const model = baseValidation(req.query.model)
    const manufacturer = baseValidation(req.query.manufacturer)
    const yearManufactured = baseValidation(req.query.yearManufactured)
    const color = baseValidation(req.query.color)
    const engine = baseValidation(req.query.engine)
    const remarks = baseValidation(req.query.remarks)
    const limit = validateLimit(req.query.limit)
    const skip = baseValidation(req.query.skip)

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