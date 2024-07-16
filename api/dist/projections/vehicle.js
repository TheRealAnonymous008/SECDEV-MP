"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeVehicleArrayView = exports.makeVehicleView = void 0;
const makeVehicleView = (document) => {
    if (document == null)
        return {};
    return {
        id: document.Id,
        licensePlate: document.LicensePlate,
        manufacturer: document.Manufacturer,
        model: document.Model,
        yearManufactured: document.YearManufactured,
        color: document.Color,
        engine: document.Engine,
        remarks: document.Remarks
    };
};
exports.makeVehicleView = makeVehicleView;
const makeVehicleArrayView = (documents) => {
    return documents.map((val) => {
        return (0, exports.makeVehicleView)(val);
    });
};
exports.makeVehicleArrayView = makeVehicleArrayView;
