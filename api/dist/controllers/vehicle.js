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
const all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    vehicle_2.VehicleRepository.retrieveAll()
        .then((result) => {
        if (result.length == 0) {
            res.status(500).end();
            return;
        }
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
        let id = parseInt(req.query.id.toString());
        vehicle_2.VehicleRepository.retrieveById(id)
            .then((result) => {
            if (result.length == 0) {
                res.status(500).end();
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
    const vehicle = {
        LicensePlate: req.body.licensePlate,
        Model: req.body.model,
        Manufacturer: req.body.manufacturer,
        YearManufactured: req.body.yearManufactured,
        Color: req.body.color,
        Engine: req.body.engine,
        Remarks: req.body.remarks
    };
    try {
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
    const vehicle = {
        LicensePlate: req.body.licensePlate,
        Model: req.body.model,
        Manufacturer: req.body.manufacturer,
        YearManufactured: req.body.yearManufactured,
        Color: req.body.color,
        Engine: req.body.engine,
        Remarks: req.body.remarks
    };
    try {
        vehicle_2.VehicleRepository.update(parseInt(req.query.id.toString()), vehicle)
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
        vehicle_2.VehicleRepository.delete(parseInt(req.query.id.toString()))
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
/*
const filter = async (req: express.Request, res: express.Response) => {
    const query : VehicleQuery = makeQuery(req);
    const count = await Vehicle.find(makeMongooseQuery(query)).countDocuments();

    Vehicle.find(makeMongooseQuery(query))
    .skip(parseInt(req.query.skip as string))
    .limit(parseInt(req.query.limit as string))
    .then((result) => {
        res.json({data : makeVehicleArrayView(result), count: count ? count : 0});
        res.end();
    }).catch((err) => {
        console.log(err);
        res.end();
    });
}

const filter = async (req: express.Request, res: express.Response) => {
    VehicleRepository.retrieve


interface VehicleQuery {
    licensePlate: string,
    model: string,
    manufacturer: string,
    yearManufactured: number,
    color: string,
    engine: string,
    remarks: string,
}

const makeMongooseQuery = (q : VehicleQuery) : any => {
    let query =  {
        licensePlate: {$regex: ".*" + q.licensePlate + ".*" , $options: "i"},
        model: {$regex: ".*" + q.model + ".*" , $options: "i"},
        manufacturer: {$regex: ".*" + q.manufacturer + ".*" , $options: "i"},
        color: {$regex: ".*" + q.color + ".*" , $options: "i"},
        engine: {$regex: ".*" + q.engine + ".*" , $options: "i"}

    }

    if (q.yearManufactured > 0){
        query["yearManufactured"] = q.yearManufactured;
    }

    return query;
}

const makeQuery = (req : express.Request) : VehicleQuery=> {
    return {
        licensePlate: (req.query.licensePlate) ? (req.query.licensePlate as string) : "",
        model: (req.query.model) ? (req.query.model as string) : "",
        manufacturer: (req.query.manufacturer) ? (req.query.manufacturer as string) : "",
        yearManufactured: (req.query.yearManufactured) ? parseInt(req.query.yearManufactured as string) : -1,
        color: (req.query.color) ? (req.query.color as string) : "",
        engine: (req.query.engine) ? (req.query.engine as string) : "",
        remarks: (req.query.remarks) ? (req.query.remarks as string) : "",
    }
}

// old SQL
const count = async (req: express.Request, res: express.Response) => {
    VehicleRepository.countDocuments()
    .then((count) => {
        res.json({vehicleCount: count});
    });
};

const all = async (req: express.Request, res: express.Response) => {
    const count = await Vehicle.countDocuments({});

    Vehicle.find({})
    .skip(parseInt(req.query.skip as string))
    .limit(parseInt(req.query.limit as string))
    .sort({$natural:-1})
    .then((data) => {
        res.json({data : makeVehicleArrayView(data), count: count ? count : 0});
    });
};

const id = async (req: express.Request, res: express.Response) => {
    Vehicle.findOne({_id : req.query.id})
    .then((data) => {
        res.json(makeVehicleView(data));
    });
};

const create = (req: express.Request, res: express.Response) => {
    Vehicle.create({_id: randomUUID(), ...req.body, })
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    })
    .finally(() => {
        res.json(req.body);
        res.end();
    });
};

const update = (req: express.Request, res: express.Response) => {
    Vehicle.updateOne({_id: req.query.id}, req.body, (err) => {
        if (err){
            console.log(err);
            res.json(null)
        }
        else {
            res.json(req.body);
        }
        res.end();
    });
};

const remove = (req: express.Request, res: express.Response) => {
    Vehicle.deleteOne({_id: req.query.id})
    .then((delRes) => {
        res.end();
    })
    .catch((err) => {
    console.log(err);
    res.end();
    });
};
*/
exports.default = { all, id, create, update, remove };