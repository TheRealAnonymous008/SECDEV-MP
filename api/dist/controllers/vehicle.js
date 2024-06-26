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
const vehicle_1 = require("../projections/vehicle");
const vehicle_2 = require("../repository/vehicle");
const inputValidation_1 = require("../middleware/inputValidation");
const all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    vehicle_2.VehicleRepository.retrieveAll()
        .then((result) => {
        res.json({
            data: (0, vehicle_1.makeVehicleArrayView)(result),
            count: result.length
        });
        res.status(200).end();
    })
        .catch((err) => {
        console.log(err);
        res.status(500).end();
    });
});
const id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        vehicle_2.VehicleRepository.retrieveById(id)
            .then((result) => {
            if (result.length == 0) {
                res.status(404).end();
                return;
            }
            res.json((0, vehicle_1.makeVehicleView)(result));
            res.status(200).end();
        })
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
        const vehicle = {
            LicensePlate: (0, inputValidation_1.validateLicensePlate)(req.body.licensePlate),
            Model: (0, inputValidation_1.validateWord)(req.body.model),
            Manufacturer: (0, inputValidation_1.validateWord)(req.body.manufacturer),
            YearManufactured: (0, inputValidation_1.validateInteger)(req.body.yearManufactured),
            Color: (0, inputValidation_1.validateWord)(req.body.color),
            Engine: (0, inputValidation_1.validateWord)(req.body.engine),
            Remarks: (0, inputValidation_1.baseValidation)(req.body.remarks)
        };
        vehicle_2.VehicleRepository.insert(vehicle)
            .then((result) => {
            if (result == undefined) {
                res.status(500).end();
                return;
            }
            res.json((0, vehicle_1.makeVehicleView)(Object.assign(Object.assign({}, vehicle), { id: result })));
            res.status(200).end();
        })
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
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = {
            LicensePlate: (0, inputValidation_1.validateLicensePlate)(req.body.licensePlate),
            Model: (0, inputValidation_1.validateWord)(req.body.model),
            Manufacturer: (0, inputValidation_1.validateWord)(req.body.manufacturer),
            YearManufactured: (0, inputValidation_1.validateInteger)(req.body.yearManufactured),
            Color: (0, inputValidation_1.validateWord)(req.body.color),
            Engine: (0, inputValidation_1.validateWord)(req.body.engine),
            Remarks: (0, inputValidation_1.baseValidation)(req.body.remarks)
        };
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        vehicle_2.VehicleRepository.update(id, vehicle)
            .then((result) => {
            if (result == undefined) {
                res.status(500).end();
                return;
            }
            res.json((0, vehicle_1.makeVehicleView)(Object.assign(Object.assign({}, vehicle), { id: result })));
            res.status(200).end();
        })
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
const remove = (req, res) => {
    try {
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        vehicle_2.VehicleRepository.delete(id)
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
    catch (error) {
        console.log(error);
        res.status(500).end();
    }
};
const filter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = makeQuery(req);
        vehicle_2.VehicleRepository.filter(query)
            .then((result) => {
            res.json({
                data: (0, vehicle_1.makeVehicleArrayView)(result),
                count: result.length
            });
            res.status(200).end();
        })
            .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
});
const makeQuery = (req) => {
    const licensePlate = (0, inputValidation_1.baseValidation)(req.query.licensePlate);
    const model = (0, inputValidation_1.baseValidation)(req.query.model);
    const manufacturer = (0, inputValidation_1.baseValidation)(req.query.manufacturer);
    const yearManufactured = (0, inputValidation_1.baseValidation)(req.query.yearManufactured);
    const color = (0, inputValidation_1.baseValidation)(req.query.color);
    const engine = (0, inputValidation_1.baseValidation)(req.query.engine);
    const remarks = (0, inputValidation_1.baseValidation)(req.query.remarks);
    const limit = (0, inputValidation_1.baseValidation)(req.query.limit);
    const skip = (0, inputValidation_1.baseValidation)(req.query.skip);
    return {
        licensePlate: (licensePlate) ? licensePlate : null,
        model: (model) ? model : null,
        manufacturer: (manufacturer) ? manufacturer : null,
        yearManufactured: (yearManufactured) ? yearManufactured : null,
        color: (color) ? color : null,
        engine: (engine) ? engine : null,
        remarks: (remarks) ? remarks : null,
        limit: (limit) ? limit : null,
        skip: (skip) ? skip : null,
    };
};
exports.default = { all, id, create, update, remove, filter };
