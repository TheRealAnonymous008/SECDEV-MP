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
const all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    order_1.OrderRespository.retrieveAll()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        res.json({
            data: yield (0, order_2.makeOrderArrayView)(result),
            count: result.length
        });
        res.status(200).end();
    }))
        .catch((err) => {
        console.log(err);
        res.status(500).end();
    });
});
const id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
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
            console.log(err);
            res.status(500).end();
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).end();
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = yield (0, inputValidation_1.validatePdf)(req.file);
        const order = {
            Status: (0, inputValidation_1.baseValidation)(req.body.status),
            TimeIn: (0, inputValidation_1.validateDate)(req.body.timeIn),
            TimeOut: (0, inputValidation_1.validateDate)(req.body.timeOut),
            CustomerId: (0, inputValidation_1.validateInteger)(req.body.customer),
            TypeId: (0, inputValidation_1.baseValidation)(req.body.type),
            VehicleId: (0, inputValidation_1.validateInteger)(req.body.vehicle),
            EstimateNumber: (0, inputValidation_1.validateAlphaNumeric)(req.body.estimateNumber),
            ScopeOfWork: (0, inputValidation_1.baseValidation)(req.body.scopeOfWork),
            Invoice: file,
            IsVerified: req.body.isVerified === 'true'
        };
        if (order.TimeIn > order.TimeOut) {
            throw new Error("Invalid Time In and Time Out");
        }
        order_1.OrderRespository.insert(order)
            .then((result) => {
            if (result == undefined) {
                res.status(500).end();
                return;
            }
            res.json((0, order_2.makeOrderView)(Object.assign(Object.assign({}, order), { Id: result })));
            res.status(200).end();
        })
            .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = {
            Status: (0, inputValidation_1.validateWord)(req.body.status),
            TimeIn: (0, inputValidation_1.validateDate)(req.body.timeIn),
            TimeOut: (0, inputValidation_1.validateDate)(req.body.timeOut),
            CustomerId: (0, inputValidation_1.validateWord)(req.body.customerId),
            TypeId: (0, inputValidation_1.validateWord)(req.body.typeId),
            VehicleId: (0, inputValidation_1.validateWord)(req.body.vehicleId),
            EstimateNumber: (0, inputValidation_1.validateWord)(req.body.estimateNumber),
            ScopeOfWork: (0, inputValidation_1.baseValidation)(req.body.scopeOfWork),
            IsVerified: req.body.isVerified === 'true'
        };
        if (order.TimeIn > order.TimeOut) {
            throw new Error("Invalid Time In and Time Out");
        }
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        order_1.OrderRespository.update(id, order)
            .then((result) => {
            if (result == undefined) {
                res.status(500).end();
                return;
            }
            res.json((0, order_2.makeOrderView)(Object.assign(Object.assign({}, order), { Id: result })));
            res.status(200).end();
        })
            .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        order_1.OrderRespository.delete(id)
            .then((result) => {
            if (result == undefined) {
                res.status(500).end();
                return;
            }
            res.status(200).end();
        })
            .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});
exports.default = { all, id, create, update, remove };
