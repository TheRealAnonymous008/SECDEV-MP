import express = require('express');
import { CustomerRepository } from '../repository/customer';
import { validateInteger } from '../middleware/inputValidation';
import { OrderRespository } from '../repository/order';
import { makeOrderArrayView, makeOrderView } from '../projections/order';

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
        let id = validateInteger(req.query.id.toString())
        CustomerRepository.retrieveById(id)
            .then((result) => {
                if (result.length == 0){
                    res.status(404).end();
                    return
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

export default {all, id};