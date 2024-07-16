import express = require('express');
import { CustomerRepository } from '../repository/customer';
import { baseValidation, validateDate, validateEmail, validateInteger, validateLimit, validateMobileNumber, validateName, validateWord } from '../middleware/inputValidation';
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

// const create = async (req: express.Request, res: express.Response) => {
//     try {
//         const customer : CustomerRow = {
//             FirstName: validateName(req.body.firstName),
//             LastName: validateName(req.body.lastName),
//             MobileNumber: validateMobileNumber(req.body.mobileNumber),
//             Email: validateEmail(req.body.email),
//             Company: validateWord(req.body.company),
//             Insurance: validateWord(req.body.insurance),
//             Remarks: req.body.remarks               // This is a free field. SQL injection is prevented via prepared statements. XSS prevented by not accepting HTML
//         };

//         CustomerRepository.insert(customer)
//             .then((result) => {
//                 if (result == undefined){
//                     res.status(500).end();
//                     return
//                 }
//                 res.json(makeCustomerView({...customer, id: result}));
//                 res.status(200).end();
//             })
//             .catch((err) => {
                        
//                 console.log(err);
//                 res.status(500).end();
//             })
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500);
//     }
// }

// const update = async (req: express.Request, res: express.Response) => {
//     try {
//         const customer : CustomerRow = {
//             FirstName: validateName(req.body.firstName),
//             LastName: validateName(req.body.lastName),
//             MobileNumber: validateMobileNumber(req.body.mobileNumber),
//             Email: validateEmail(req.body.email),
//             Company: validateWord(req.body.company),
//             Insurance: validateWord(req.body.insurance),
//             Remarks: req.body.remarks
//         };
//         let id = validateInteger(req.query.id.toString())
        
//         CustomerRepository.update(id, customer)
//             .then((result) => {
//                 if (result == undefined){
//                     res.status(500).end();
//                     return
//                 }
//                 res.json(makeCustomerView({...customer, id: result}));
//                 res.status(200).end();
//             })
//             .catch((err) => {
                        
//                 console.log(err);
//                 res.status(500).end();
//             })
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500);
//     }
// }

// const remove = async (req: express.Request, res: express.Response) => {
//     try {
//         let id = validateInteger(req.query.id.toString())

//         CustomerRepository.delete(id)
//             .then((result) => {
//                 if (result == undefined){
//                     res.status(500).end();
//                     return
//                 }
//                 res.status(200).end();
//             })
//             .catch((err) => {
                        
//                 console.log(err);
//                 res.status(500).end();
//             })
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500);
//     }
// }

export default {all, id, create, update, remove};