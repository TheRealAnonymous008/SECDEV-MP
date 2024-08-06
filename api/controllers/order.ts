import express = require('express');
import { baseValidation, validateAlphaNumeric, validateDate, validateInteger, validatePdf, validateWord } from '../middleware/inputValidation';
import { OrderRespository } from '../repository/order';
import { makeOrderArrayView, makeOrderView } from '../projections/order';
import { OrderRow } from '../models/order';

const all = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    OrderRespository.retrieveAll()
        .then(async (result) => {
            const data =  await makeOrderArrayView(result).catch((err) => {next(err)});
            res.json({
                data: data,
                count : result.length 
            });
            res.status(200).end();
        })
        .catch((err) => {
            next(err)
        })
}

const id = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let id = validateInteger(req.query.id.toString());
        OrderRespository.retrieveById(id)
            .then(async (result) => {
                if (result.length == 0){
                    res.status(404).end();
                    return;
                }
                res.json(await makeOrderView(result));
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            })
    } catch (error) {
        next(error)
    }
}

const create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const file = await validatePdf(req.files[0] as Express.Multer.File).catch((err) => {throw err});

        const order: OrderRow = {
            Status: baseValidation(req.body.status),
            TimeIn: validateDate(req.body.timeIn),
            TimeOut: validateDate(req.body.timeOut),
            CustomerId: validateInteger(req.body.customer),
            TypeId: baseValidation(req.body.type),
            VehicleId: validateInteger(req.body.vehicle),
            EstimateNumber: validateAlphaNumeric(req.body.estimateNumber),
            ScopeOfWork: baseValidation(req.body.scopeOfWork), 
            Invoice: file,
            IsVerified: req.body.isVerified === 'true'
        };

        if (order.TimeIn > order.TimeOut){
            throw new Error("Invalid Time In and Time Out")
        }

        OrderRespository.insert(order)
            .then(async (result) => {
                if (result == undefined){
                    throw new Error(`Failed to create order with params ${order}`)
                }
                res.json(await makeOrderView({...order, Id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            })
    } catch (err) {
        next(err)
    }
}

const update = async (req: express.Request, res: express.Response,  next: express.NextFunction) => {
    try {
        const order: OrderRow = {
            Status: baseValidation(req.body.status),
            TimeIn: validateDate(req.body.timeIn),
            TimeOut: validateDate(req.body.timeOut),
            CustomerId: validateInteger(req.body.customer),
            TypeId: baseValidation(req.body.type),
            VehicleId: validateInteger(req.body.vehicle),
            EstimateNumber: validateAlphaNumeric(req.body.estimateNumber),
            ScopeOfWork: baseValidation(req.body.scopeOfWork), 
            IsVerified: req.body.isVerified === 'true'
        };

        if (order.TimeIn > order.TimeOut){
            throw new Error("Invalid Time In and Time Out")
        }
        
        let id = validateInteger(req.query.id.toString());

        OrderRespository.update(id, order)
            .then((result) => {
                if (result == undefined){
                    throw new Error(`Failed to update order with id ${id}`)
                }
                res.json(makeOrderView({...order, Id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            })
    } catch (err) {
        next(err)
    }
}

const remove = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let id = validateInteger(req.query.id.toString());

        OrderRespository.delete(id)
            .then((result) => {
                if (result == undefined){
                    throw new Error(`Failed to delete order with id ${id}`)
                }
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            })
    } catch (err) {
        next(err)
    }
}

const verify = async (req: express.Request, res: express.Response,  next: express.NextFunction) => {
    try {
        let id = validateInteger(req.query.id.toString());

        OrderRespository.verify(id)
            .then((result) => {
                if (result == undefined){
                    throw new Error(`Failed to update order with id ${id}`)
                }
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            })
    } catch (err) {
        next(err)
    }
}

export default {all, id, create, update, remove, verify};