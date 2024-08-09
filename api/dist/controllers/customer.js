"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_1 = require("../projections/customer");
const customer_2 = require("../repository/customer");
const inputValidation_1 = require("../middleware/inputValidation");
const logger_1 = __importDefault(require("../utils/logger"));
const logConfig_1 = require("../config/logConfig");
const all = (req, res, next) => {
    customer_2.CustomerRepository.retrieveAll()
        .then((result) => {
        res.json({
            data: (0, customer_1.makeCustomerArrayView)(result),
            count: result.length
        });
        logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Retrieved all customers`);
        res.status(200).end();
    })
        .catch((err) => {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving all customers: ${err.message}`);
        next(err);
    });
};
const id = (req, res, next) => {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        customer_2.CustomerRepository.retrieveById(id)
            .then((result) => {
            if (result.length == 0) {
                logger_1.default.log(logConfig_1.LogLevel.DEBUG, `Customer not found: ${id}`);
                res.status(404).end();
                return;
            }
            res.json((0, customer_1.makeCustomerView)(result));
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Customer retrieved: ${id}`);
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving customer by id ${id}: ${err.message}`);
            next(err);
        });
    }
    catch (error) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Validation error in id function: ${error.message}`);
        next(error);
    }
};
const create = (req, res, next) => {
    try {
        const customer = {
            FirstName: (0, inputValidation_1.validateRequired)(req.body.firstName, inputValidation_1.validateName),
            LastName: (0, inputValidation_1.validateRequired)(req.body.lastName, inputValidation_1.validateName),
            MobileNumber: (0, inputValidation_1.validateRequired)(req.body.mobileNumber, inputValidation_1.validateMobileNumber),
            Email: (0, inputValidation_1.validateRequired)(req.body.email, inputValidation_1.validateEmail),
            Company: (0, inputValidation_1.validateRequired)(req.body.company, inputValidation_1.validateWord),
            Insurance: (0, inputValidation_1.validateRequired)(req.body.insurance, inputValidation_1.validateWord),
            Remarks: (0, inputValidation_1.validateOptional)(req.body.remarks, inputValidation_1.baseValidation) // This is a free field. SQL injection is prevented via prepared statements. XSS prevented by not accepting HTML
        };
        customer_2.CustomerRepository.insert(customer)
            .then((result) => {
            if (result == undefined) {
                logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Failed to create customer with params ${customer}`);
                throw new Error(`Failed to create customer with params ${customer}`);
            }
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Customer created: ${JSON.stringify(Object.assign(Object.assign({}, customer), { id: result }))}`);
            res.json((0, customer_1.makeCustomerView)(Object.assign(Object.assign({}, customer), { id: result })));
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error creating customer: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in create function: ${err.message}`);
        next(err);
    }
};
const update = (req, res, next) => {
    try {
        const customer = {
            FirstName: (0, inputValidation_1.validateRequired)(req.body.firstName, inputValidation_1.validateName),
            LastName: (0, inputValidation_1.validateRequired)(req.body.lastName, inputValidation_1.validateName),
            MobileNumber: (0, inputValidation_1.validateRequired)(req.body.mobileNumber, inputValidation_1.validateMobileNumber),
            Email: (0, inputValidation_1.validateRequired)(req.body.email, inputValidation_1.validateEmail),
            Company: (0, inputValidation_1.validateRequired)(req.body.company, inputValidation_1.validateWord),
            Insurance: (0, inputValidation_1.validateRequired)(req.body.insurance, inputValidation_1.validateWord),
            Remarks: (0, inputValidation_1.validateOptional)(req.body.remarks, inputValidation_1.baseValidation)
        };
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        customer_2.CustomerRepository.update(id, customer)
            .then((result) => {
            if (result == undefined) {
                throw new Error(`Failed to update customer with id ${id}`);
            }
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Customer updated: ${JSON.stringify(Object.assign(Object.assign({}, customer), { id: result }))}`);
            res.json((0, customer_1.makeCustomerView)(Object.assign(Object.assign({}, customer), { id: result })));
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error updating customer with id ${id}: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in update function: ${err.message}`);
        next(err);
    }
};
const remove = (req, res, next) => {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        customer_2.CustomerRepository.delete(id)
            .then((result) => {
            if (result == undefined) {
                throw new Error(`Failed to delete customer with id ${id}`);
            }
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Customer deleted: ${id}`);
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error deleting customer with id ${id}: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in remove function: ${err.message}`);
        next(err);
    }
};
const filter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = makeQuery(req);
        customer_2.CustomerRepository.filter(query)
            .then((result) => {
            res.json({
                data: (0, customer_1.makeCustomerArrayView)(result),
                count: result.length
            });
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Filtered customers`);
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error filtering customers: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error in filter function: ${err.message}`);
        next(err);
    }
});
const makeQuery = (req) => {
    const name = (0, inputValidation_1.validateOptional)(req.query.name, inputValidation_1.baseValidation);
    const email = (0, inputValidation_1.validateOptional)(req.query.email, inputValidation_1.baseValidation);
    const mobileNumber = (0, inputValidation_1.validateOptional)(req.query.mobileNumber, inputValidation_1.baseValidation);
    const company = (0, inputValidation_1.validateOptional)(req.query.company, inputValidation_1.baseValidation);
    const insurance = (0, inputValidation_1.validateOptional)(req.query.insurance, inputValidation_1.baseValidation);
    const remarks = (0, inputValidation_1.validateOptional)(req.query.remarks, inputValidation_1.baseValidation);
    const limit = (0, inputValidation_1.validateOptional)(req.query.limit, inputValidation_1.validateLimit);
    const skip = (0, inputValidation_1.validateOptional)(req.query.skip, inputValidation_1.baseValidation);
    return {
        name: (name) ? name : null,
        email: (email) ? email : null,
        mobileNumber: (mobileNumber) ? mobileNumber : null,
        company: (company) ? company : null,
        insurance: (insurance) ? insurance : null,
        remarks: (remarks) ? remarks : null,
        limit: (limit) ? limit : null,
        skip: (skip) ? skip : null,
    };
};
exports.default = { all, id, create, update, remove, filter };
