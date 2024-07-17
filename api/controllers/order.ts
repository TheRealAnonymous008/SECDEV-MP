import express = require('express');
import { baseValidation, validateDate, validateInteger, validateWord } from '../middleware/inputValidation';
import { OrderRespository } from '../repository/order';
import { makeOrderArrayView, makeOrderView } from '../projections/order';
import { OrderRow } from '../models/order';

const all = async (req: express.Request, res: express.Response) => {
    OrderRespository.retrieveAll()
        .then((result) => {
            res.json({
                data: makeOrderArrayView(result),
                count : result.length 
            });
            res.status(200).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        })
}

const id = async (req: express.Request, res: express.Response) => {
    try {
        let id = validateInteger(req.query.id.toString());
        OrderRespository.retrieveById(id)
            .then((result) => {
                if (result.length == 0){
                    res.status(404).end();
                    return;
                }
                res.json(makeOrderView(result));
                res.status(200).end();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).end();
            })
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}

const create = async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.body)
        const order: OrderRow = {
            Status: validateWord(req.body.status),
            TimeIn: validateDate(req.body.timeIn),
            TimeOut: validateDate(req.body.timeOut),
            CustomerId: validateInteger(req.body.customer),
            TypeId: validateWord(req.body.typeId),
            VehicleId: validateInteger(req.body.vehicle),
            EstimateNumber: validateWord(req.body.estimateNumber),
            ScopeOfWork: baseValidation(req.body.scopeOfWork),  // Free field, SQL injection and XSS prevention assumed
            IsVerified: req.body.isVerified === 'true'
        };

        if (order.TimeIn > order.TimeOut){
            throw new Error("Invalid Time In and Time Out")
        }

        OrderRespository.insert(order)
            .then((result) => {
                if (result == undefined){
                    res.status(500).end();
                    return;
                }
                res.json(makeOrderView({...order, Id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).end();
            })
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}

const update = async (req: express.Request, res: express.Response) => {
    try {
        const order: OrderRow = {
            Status: validateWord(req.body.status),
            TimeIn: validateDate(req.body.timeIn),
            TimeOut: validateDate(req.body.timeOut),
            CustomerId: validateWord(req.body.customerId),
            TypeId: validateWord(req.body.typeId),
            VehicleId: validateWord(req.body.vehicleId),
            EstimateNumber: validateWord(req.body.estimateNumber),
            ScopeOfWork: baseValidation(req.body.scopeOfWork),  // Free field, SQL injection and XSS prevention assumed
            IsVerified: req.body.isVerified === 'true'
        };

        if (order.TimeIn > order.TimeOut){
            throw new Error("Invalid Time In and Time Out")
        }
        
        let id = validateInteger(req.query.id.toString());

        OrderRespository.update(id, order)
            .then((result) => {
                if (result == undefined){
                    res.status(500).end();
                    return;
                }
                res.json(makeOrderView({...order, Id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).end();
            })
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}

const remove = async (req: express.Request, res: express.Response) => {
    try {
        let id = validateInteger(req.query.id.toString());

        OrderRespository.delete(id)
            .then((result) => {
                if (result == undefined){
                    res.status(500).end();
                    return;
                }
                res.status(200).end();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).end();
            })
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}

export default {all, id, create, update, remove};