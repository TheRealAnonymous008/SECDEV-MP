import express = require('express');
import { makeCustomerArrayView, makeCustomerView } from '../projections/customer';
import { CustomerQuery, CustomerRepository } from '../repository/customer';
import { CustomerRow } from '../models/customer';
import { baseValidation, validateEmail, validateInteger, validateLimit, validateMobileNumber, validateName, validateWord } from '../middleware/inputValidation';

const all = (req: express.Request, res: express.Response) => {
    CustomerRepository.retrieveAll()
        .then((result) => {
            res.json({
                data: makeCustomerArrayView(result),
                count : result.length 
            });
            res.status(200).end();
        })
        .catch((err) => {
                    
            console.log(err);
            res.status(500).end();
        })
}

const id = (req: express.Request, res: express.Response) => {
    try {
        let id = validateInteger(req.query.id.toString())
        CustomerRepository.retrieveById(id)
            .then((result) => {
                if (result.length == 0){
                    res.status(404).end();
                    return
                }
                res.json(makeCustomerView(result));
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

const create = (req: express.Request, res: express.Response) => {
    try {
        const customer : CustomerRow = {
            FirstName: validateName(req.body.firstName),
            LastName: validateName(req.body.lastName),
            MobileNumber: validateMobileNumber(req.body.mobileNumber),
            Email: validateEmail(req.body.email),
            Company: validateWord(req.body.company),
            Insurance: validateWord(req.body.insurance),
            Remarks: baseValidation(req.body.remarks)               // This is a free field. SQL injection is prevented via prepared statements. XSS prevented by not accepting HTML
        };

        CustomerRepository.insert(customer)
            .then((result) => {
                if (result == undefined){
                    res.status(500).end();
                    return
                }
                res.json(makeCustomerView({...customer, id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                        
                console.log(err);
                res.status(500).end();
            })
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
}

const update = (req: express.Request, res: express.Response) => {
    try {
        const customer : CustomerRow = {
            FirstName: validateName(req.body.firstName),
            LastName: validateName(req.body.lastName),
            MobileNumber: validateMobileNumber(req.body.mobileNumber),
            Email: validateEmail(req.body.email),
            Company: validateWord(req.body.company),
            Insurance: validateWord(req.body.insurance),
            Remarks: baseValidation(req.body.remarks)
        };
        let id = validateInteger(req.query.id.toString())
        
        CustomerRepository.update(id, customer)
            .then((result) => {
                if (result == undefined){
                    res.status(500).end();
                    return
                }
                res.json(makeCustomerView({...customer, id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).end();
            })
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
}

const remove = (req: express.Request, res: express.Response) => {
    try {
        let id = validateInteger(req.query.id.toString())

        CustomerRepository.delete(id)
            .then((result) => {
                if (result == undefined){
                    res.status(500).end();
                    return
                }
                res.status(200).end();
            })
            .catch((err) => {
                        
                console.log(err);
                res.status(500).end();
            })
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
}


const filter = async (req: express.Request, res: express.Response) => {
    try {
        const query = makeQuery(req)
        CustomerRepository.filter(query)
            .then((result) => {
                res.json({
                    data: makeCustomerArrayView(result),
                    count : result.length 
                });
                res.status(200).end();
            })
            .catch((err) => {
                        
                console.log(err);
                res.status(500).end();
            })
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
}

const makeQuery = (req : express.Request) : CustomerQuery => {
    const name = baseValidation(req.query.name)
    const email = baseValidation(req.query.email)
    const mobileNumber = baseValidation(req.query.mobileNumber)
    const company = baseValidation(req.query.company)
    const insurance = baseValidation(req.query.insurance)
    const remarks = baseValidation(req.query.remarks)
    const limit = validateLimit(req.query.limit)
    const skip = baseValidation(req.query.skip)

    return {
        name: (name) ? (name as string) : null,
        email: (email) ? (email as string) : null,
        mobileNumber: (mobileNumber) ? (mobileNumber as string) : null,
        company: (company) ? (company as string) : null,
        insurance: (insurance) ? (insurance as string) : null,
        remarks: (remarks) ? (remarks as string) : null,
        limit: (limit) ? (limit as number) : null,
        skip: (skip) ? (skip as number) : null,
    }
}


export default {all, id, create, update, remove, filter};