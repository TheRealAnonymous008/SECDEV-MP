import express = require('express');
import { makeCustomerArrayView, makeCustomerView } from '../projections/customer';
import { CustomerQuery, CustomerRepository } from '../repository/customer';
import { CustomerRow } from '../models/customer';
import { baseValidation, validateEmail, validateInteger, validateLimit, validateMobileNumber, validateName, validateOptional, validateRequired, validateWord } from '../middleware/inputValidation';
import logger from '../utils/logger';
import { LogLevel } from '../config/logConfig';

const all = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    CustomerRepository.retrieveAll()
        .then((result) => {
            res.json({
                data: makeCustomerArrayView(result),
                count : result.length 
            });
            res.status(200).end();
        })
        .catch((err) => {
            logger.log(LogLevel.ERRORS, `Error retrieving all customers: ${err.message}`);
            next(err);
        });
}

const id = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let id = validateRequired(req.query.id.toString(), validateInteger);
        CustomerRepository.retrieveById(id)
            .then((result) => {
                if (result.length == 0) {
                    res.status(404).end();
                    return;
                }
                res.json(makeCustomerView(result));
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error retrieving customer by id ${id}: ${err.message}`);
                next(err);
            });
    } catch (error) {
        logger.log(LogLevel.ERRORS, `Validation error in id function: ${error.message}`);
        next(error);
    }
}

const create = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const customer : CustomerRow = {
            FirstName: validateRequired(req.body.firstName, validateName),
            LastName: validateRequired(req.body.lastName, validateName),
            MobileNumber: validateRequired(req.body.mobileNumber, validateMobileNumber),
            Email: validateRequired(req.body.email, validateEmail),
            Company: validateRequired(req.body.company, validateWord),
            Insurance: validateRequired(req.body.insurance, validateWord),
            Remarks: validateOptional(req.body.remarks, baseValidation)             // This is a free field. SQL injection is prevented via prepared statements. XSS prevented by not accepting HTML
        };

        CustomerRepository.insert(customer)
            .then((result) => {
                if (result == undefined){
                    throw new Error(`Failed to create customer with params ${customer}`);
                }
                logger.log(LogLevel.AUDIT, `Customer created: ${JSON.stringify({...customer, id: result})}`);
                res.json(makeCustomerView({...customer, id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error creating customer: ${err.message}`);
                next(err);
            });
    }
    catch (err) {
        logger.log(LogLevel.ERRORS, `Error in create function: ${err.message}`);
        next(err);
    }
}

const update = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const customer : CustomerRow = {
            FirstName: validateRequired(req.body.firstName, validateName),
            LastName: validateRequired(req.body.lastName, validateName),
            MobileNumber: validateRequired(req.body.mobileNumber, validateMobileNumber),
            Email: validateRequired(req.body.email, validateEmail),
            Company: validateRequired(req.body.company, validateWord),
            Insurance: validateRequired(req.body.insurance, validateWord),
            Remarks: validateOptional(req.body.remarks, baseValidation) 
        };
        let id = validateRequired(req.query.id.toString(), validateInteger);
        
        CustomerRepository.update(id, customer)
            .then((result) => {
                if (result == undefined){
                    throw new Error(`Failed to update customer with id ${id}`);
                }
                logger.log(LogLevel.AUDIT, `Customer updated: ${JSON.stringify({...customer, id: result})}`);
                res.json(makeCustomerView({...customer, id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error updating customer with id ${id}: ${err.message}`);
                next(err);
            });
    }
    catch (err) {
        logger.log(LogLevel.ERRORS, `Error in update function: ${err.message}`);
        next(err);
    }
}

const remove = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let id = validateRequired(req.query.id.toString(), validateInteger);

        CustomerRepository.delete(id)
            .then((result) => {
                if (result == undefined){
                    throw new Error(`Failed to delete customer with id ${id}`);
                }
                logger.log(LogLevel.AUDIT, `Customer deleted: ${id}`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error deleting customer with id ${id}: ${err.message}`);
                next(err);
            });
    }
    catch (err) {
        logger.log(LogLevel.ERRORS, `Error in remove function: ${err.message}`);
        next(err);
    }
}

const filter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const query = makeQuery(req);
        CustomerRepository.filter(query)
            .then((result) => {
                res.json({
                    data: makeCustomerArrayView(result),
                    count : result.length 
                });
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error filtering customers: ${err.message}`);
                next(err);
            });
    }
    catch (err) {
        logger.log(LogLevel.ERRORS, `Error in filter function: ${err.message}`);
        next(err);
    }
}

const makeQuery = (req: express.Request): CustomerQuery => {
    const name = validateRequired(req.query.name, baseValidation);
    const email = validateRequired(req.query.email, baseValidation);
    const mobileNumber = validateRequired(req.query.mobileNumber, baseValidation);
    const company = validateRequired(req.query.company, baseValidation);
    const insurance = validateRequired(req.query.insurance, baseValidation);
    const remarks = validateRequired(req.query.remarks, baseValidation);
    const limit = validateRequired(req.query.limit, validateLimit);
    const skip = validateRequired(req.query.skip, baseValidation);

    return {
        name: (name) ? (name as string) : null,
        email: (email) ? (email as string) : null,
        mobileNumber: (mobileNumber) ? (mobileNumber as string) : null,
        company: (company) ? (company as string) : null,
        insurance: (insurance) ? (insurance as string) : null,
        remarks: (remarks) ? (remarks as string) : null,
        limit: (limit) ? (limit as number) : null,
        skip: (skip) ? (skip as number) : null,
    };
}

export default { all, id, create, update, remove, filter };
