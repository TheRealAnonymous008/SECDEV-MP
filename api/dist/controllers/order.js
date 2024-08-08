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
Object.defineProperty(exports, "__esModule", { value: true });
const inputValidation_1 = require("../middleware/inputValidation");
const order_1 = require("../repository/order");
const order_2 = require("../projections/order");
const ORDER_TABLE_NAME = "order";
const all = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    order_1.OrderRespository.retrieveAll()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield (0, order_2.makeOrderArrayView)(result).catch((err) => { next(err); });
        res.json({
            data: data,
            count: result.length
        });
        res.status(200).end();
    }))
        .catch((err) => {
        next(err);
    });
});
const id = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        order_1.OrderRespository.retrieveById(id)
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (result.length == 0) {
                res.status(404).end();
                return;
            }
            res.json(yield (0, order_2.makeOrderView)(result));
            res.status(200).end();
        }))
            .catch((err) => {
            next(err);
        });
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = yield (0, inputValidation_1.validatePdf)(req.files[0]);
        const order = {
            Status: (0, inputValidation_1.validateRequired)(req.body.status, inputValidation_1.baseValidation),
            TimeIn: (0, inputValidation_1.validateRequired)(req.body.timeIn, inputValidation_1.validateDate),
            TimeOut: (0, inputValidation_1.validateRequired)(req.body.timeOut, inputValidation_1.validateDate),
            CustomerId: (0, inputValidation_1.validateRequired)(req.body.customer, inputValidation_1.validateInteger),
            TypeId: (0, inputValidation_1.validateRequired)(req.body.type, inputValidation_1.baseValidation),
            VehicleId: (0, inputValidation_1.validateRequired)(req.body.vehicle, inputValidation_1.validateInteger),
            EstimateNumber: (0, inputValidation_1.validateRequired)(req.body.estimateNumber, inputValidation_1.validateAlphaNumeric),
            ScopeOfWork: (0, inputValidation_1.validateRequired)(req.body.scopeOfWork, inputValidation_1.baseValidation),
            Invoice: file,
            IsVerified: req.body.isVerified === 'true'
        };
        if (order.TimeIn > order.TimeOut) {
            throw new Error("Invalid Time In and Time Out");
        }
        order_1.OrderRespository.insert(order)
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (result == undefined) {
                throw new Error(`Failed to create order with params ${order}`);
            }
            res.json(yield (0, order_2.makeOrderView)(Object.assign(Object.assign({}, order), { Id: result })));
            res.status(200).end();
        }))
            .catch((err) => {
            next(err);
        });
    }
    catch (err) {
        next(err);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = {
            Status: (0, inputValidation_1.validateRequired)(req.body.status, inputValidation_1.baseValidation),
            TimeIn: (0, inputValidation_1.validateRequired)(req.body.timeIn, inputValidation_1.validateDate),
            TimeOut: (0, inputValidation_1.validateRequired)(req.body.timeOut, inputValidation_1.validateDate),
            CustomerId: (0, inputValidation_1.validateRequired)(req.body.customer, inputValidation_1.validateInteger),
            TypeId: (0, inputValidation_1.validateRequired)(req.body.type, inputValidation_1.baseValidation),
            VehicleId: (0, inputValidation_1.validateRequired)(req.body.vehicle, inputValidation_1.validateInteger),
            EstimateNumber: (0, inputValidation_1.validateRequired)(req.body.estimateNumber, inputValidation_1.validateAlphaNumeric),
            ScopeOfWork: (0, inputValidation_1.validateRequired)(req.body.scopeOfWork, inputValidation_1.baseValidation),
            IsVerified: req.body.isVerified === 'true'
        };
        if (order.TimeIn > order.TimeOut) {
            throw new Error("Invalid Time In and Time Out");
        }
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        order_1.OrderRespository.update(id, order)
            .then((result) => {
            if (result == undefined) {
                throw new Error(`Failed to update order with id ${id}`);
            }
            res.json((0, order_2.makeOrderView)(Object.assign(Object.assign({}, order), { Id: result })));
            res.status(200).end();
        })
            .catch((err) => {
            next(err);
        });
    }
    catch (err) {
        next(err);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        order_1.OrderRespository.delete(id)
            .then((result) => {
            if (result == undefined) {
                throw new Error(`Failed to delete order with id ${id}`);
            }
            res.status(200).end();
        })
            .catch((err) => {
            next(err);
        });
    }
    catch (err) {
        next(err);
    }
});
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        order_1.OrderRespository.verify(id)
            .then((result) => {
            if (result == undefined) {
                throw new Error(`Failed to update order with id ${id}`);
            }
            res.status(200).end();
        })
            .catch((err) => {
            next(err);
        });
    }
    catch (err) {
        next(err);
    }
});
const filter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = makeQuery(req);
        order_1.OrderRespository.filter(query)
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            res.json({
                data: yield (0, order_2.makeOrderArrayView)(result),
                count: result.length
            });
            res.status(200).end();
        }))
            .catch((err) => {
            next(err);
        });
    }
    catch (err) {
        next(err);
    }
});
const makeQuery = (req) => {
    const status = (0, inputValidation_1.validateOptional)(req.query.status, inputValidation_1.baseValidation);
    const timeIn = (0, inputValidation_1.validateOptional)(req.query.timeIn, inputValidation_1.validateDate);
    const timeOut = (0, inputValidation_1.validateOptional)(req.query.timeOut, inputValidation_1.validateDate);
    const customer = (0, inputValidation_1.validateOptional)(req.query.customer, inputValidation_1.validateInteger);
    const type = (0, inputValidation_1.validateOptional)(req.query.type, inputValidation_1.baseValidation);
    const vehicle = (0, inputValidation_1.validateOptional)(req.query.vehicle, inputValidation_1.validateInteger);
    const estimateNumber = (0, inputValidation_1.validateOptional)(req.query.estimateNumber, inputValidation_1.validateAlphaNumeric);
    const scopeOfWork = (0, inputValidation_1.validateOptional)(req.query.scopeOfWork, inputValidation_1.baseValidation);
    const isVerified = (0, inputValidation_1.validateOptional)(req.query.isVerified, inputValidation_1.validateWord);
    const limit = (0, inputValidation_1.validateOptional)(req.query.limit, inputValidation_1.validateInteger);
    const skip = (0, inputValidation_1.validateOptional)(req.query.skip, inputValidation_1.validateInteger);
    return {
        Status: (status) ? status : null,
        TimeIn: (timeIn) ? timeIn : null,
        TimeOut: (timeOut) ? timeOut : null,
        CustomerId: (customer) ? customer : null,
        TypeId: (type) ? type : null,
        VehicleId: (vehicle) ? vehicle : null,
        EstimateNumber: (estimateNumber) ? estimateNumber : null,
        ScopeOfWork: (scopeOfWork) ? scopeOfWork : null,
        IsVerified: (isVerified) ? isVerified : null,
        limit: (limit) ? limit : null,
        skip: (skip) ? skip : null,
    };
};
exports.default = { all, id, create, update, remove, verify, filter };
