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
exports.makeOrderArrayView = exports.makeOrderView = void 0;
const customer_1 = require("../repository/customer");
const vehicle_1 = require("../repository/vehicle");
const customer_2 = require("./customer");
const vehicle_2 = require("./vehicle");
const makeOrderView = (document) => __awaiter(void 0, void 0, void 0, function* () {
    if (document == null)
        return {};
    const order = {
        id: document.ID,
        isVerified: document.IsVerified,
        status: document.Status,
        timeIn: document.TimeIn,
        timeOut: document.TimeOut,
        customer: yield retrieveCustomer(document.CustomerId),
        type: document.TypeId,
        vehicle: yield retrieveVehicle(document.VehicleId),
        estimateNumber: document.EstimateNumber,
        scopeOfWork: document.ScopeOfWork,
        // expenses: document.expenses.map((value) => {
        //     return makeExpenseView(value)
        // }),
    };
    console.log(order);
    return order;
});
exports.makeOrderView = makeOrderView;
const makeOrderArrayView = (documents) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(documents.map((val) => __awaiter(void 0, void 0, void 0, function* () {
        const v = yield (0, exports.makeOrderView)(val);
        return v;
    })));
});
exports.makeOrderArrayView = makeOrderArrayView;
const retrieveCustomer = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return customer_1.CustomerRepository.retrieveById(id)
            .then((result) => {
            if (result.length == 0) {
                return null;
            }
            const view = (0, customer_2.makeCustomerView)(result);
            return view;
        })
            .catch((err) => {
            console.log(err);
            return null;
        });
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
const retrieveVehicle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return vehicle_1.VehicleRepository.retrieveById(id)
            .then((result) => {
            if (result.length == 0) {
                return null;
            }
            const view = (0, vehicle_2.makeVehicleView)(result);
            return view;
        })
            .catch((err) => {
            console.log(err);
            return null;
        });
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
