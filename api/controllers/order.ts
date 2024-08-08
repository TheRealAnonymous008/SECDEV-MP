import express = require('express');
import { baseValidation, validateAlphaNumeric, validateDate, validateInteger, validatePdf, validateWord, validateRequired, validateOptional } from '../middleware/inputValidation';
import { OrderQuery, OrderRespository } from '../repository/order';
import { makeOrderArrayView, makeOrderView } from '../projections/order';
import { OrderRow } from '../models/order';
import { queryBuilder } from '../utils/dbUtils';

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
        let id = validateRequired(req.query.id.toString(), validateInteger);
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
        const file = await validatePdf(req.files[0] as Express.Multer.File);

        const order: OrderRow = {
            Status: validateRequired(req.body.status, baseValidation),
            TimeIn: validateRequired(req.body.timeIn, validateDate),
            TimeOut: validateRequired(req.body.timeOut, validateDate),
            CustomerId: validateRequired(req.body.customer, validateInteger),
            TypeId: validateRequired(req.body.type, baseValidation),
            VehicleId: validateRequired(req.body.vehicle, validateInteger),
            EstimateNumber: validateRequired(req.body.estimateNumber, validateAlphaNumeric),
            ScopeOfWork: validateRequired(req.body.scopeOfWork, baseValidation), 
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
            Status: validateRequired(req.body.status, baseValidation),
            TimeIn: validateRequired(req.body.timeIn, validateDate),
            TimeOut: validateRequired(req.body.timeOut, validateDate),
            CustomerId: validateRequired(req.body.customer, validateInteger),
            TypeId: validateRequired(req.body.type, baseValidation),
            VehicleId: validateRequired(req.body.vehicle, validateInteger),
            EstimateNumber: validateRequired(req.body.estimateNumber, validateAlphaNumeric),
            ScopeOfWork: validateRequired(req.body.scopeOfWork, baseValidation), 
            IsVerified: req.body.isVerified === 'true'
        };

        if (order.TimeIn > order.TimeOut){
            throw new Error("Invalid Time In and Time Out")
        }
        
        let id = validateRequired(req.query.id.toString(), validateInteger);

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
        let id = validateRequired(req.query.id.toString(), validateInteger);

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
        let id = validateRequired(req.query.id.toString(), validateInteger);

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

const filter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const query = makeQuery(req);
        OrderRespository.filter(query)
            .then(async (result) => {
                res.json({
                    data: await makeOrderArrayView(result),
                    count : result.length 
                });
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            })
    } catch (err) {
        next(err)
    }
}

const makeQuery = (req: express.Request): OrderQuery => { 
    const status = validateOptional(req.query.status, baseValidation);
    const timeIn = validateOptional(req.query.timeIn, validateDate);
    const timeOut = validateOptional(req.query.timeOut, validateDate);
    const customer = validateOptional(req.query.customer, validateInteger);
    const type = validateOptional(req.query.type, baseValidation);
    const vehicle = validateOptional(req.query.vehicle, validateInteger);
    const estimateNumber = validateOptional(req.query.estimateNumber, validateAlphaNumeric);
    const scopeOfWork = validateOptional(req.query.scopeOfWork, baseValidation);
    const isVerified = validateOptional(req.query.isVerified, validateWord);
    const limit = validateOptional(req.query.limit, validateInteger);
    const skip = validateOptional(req.query.skip, validateInteger);

    return {
        Status: (status) ? (status as string) : null,
        TimeIn: (timeIn) ? (timeIn as string) : null,
        TimeOut: (timeOut) ? (timeOut as string) : null,
        CustomerId: (customer) ? (customer as number) : null,
        TypeId: (type) ? (type as string) : null,
        VehicleId: (vehicle) ? (vehicle as number) : null,
        EstimateNumber: (estimateNumber) ? (estimateNumber as string) : null,
        ScopeOfWork: (scopeOfWork) ? (scopeOfWork as string) : null,
        IsVerified: (isVerified) ? (isVerified as boolean) : null,
        limit: (limit) ? (limit as number) : null,
        skip: (skip) ? (skip as number) : null,
    };
}

export default {all, id, create, update, remove, verify, filter};