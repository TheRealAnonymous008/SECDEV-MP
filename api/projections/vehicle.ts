export const makeVehicleView = (document) => {
    if (document == null)
        return {};
    
    return {
        id : document.Id,
        licensePlate: document.LicensePlate,
        manufacturer: document.Manufacturer,
        model: document.Model,
        yearManufactured: document.YearManufactured,
        color: document.Color,
        engine: document.Engine,
        remarks: document.Remarks

    };
}

export const makeVehicleArrayView = (documents) => {
    return documents.map((val) => {
        return makeVehicleView(val)
    });
}