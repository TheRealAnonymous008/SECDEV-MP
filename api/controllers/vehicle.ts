import { randomInt, randomUUID } from 'crypto';
import  express = require('express');
import BCrypt = require('bcryptjs');
import { ALL_ROLES, Roles } from '../models/enum';
import { makeVehicleArrayView, makeVehicleView } from '../projections/vehicle';
import { VehicleRepository } from '../repository/vehicle';
import Vehicle, { VehicleRow } from '../models/vehicle';

const all = async (req: express.Request, res: express.Response) => {
    VehicleRepository.retrieveAll()
    .then((result) => {
        if (result.length == 0){
            res.status(500).end();
            return
        }
        res.json({
            data: makeVehicleArrayView(result),
            count : result.length 
        });
        res.status(200).end();
    })
    .catch((err) => {
        console.log(err);
        res.status(500).end();
    })
}

const id = async (req: express.Request, res: express.Response) => {
    try {
        let id = parseInt(req.query.id.toString())
        VehicleRepository.retrieveById(id)
        .then((result) => {
            if (result.length == 0){
                res.status(500).end();
                return
            }
            res.json(makeVehicleView(result));
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

const create = async (req: express.Request, res: express.Response) => {
    const vehicle : VehicleRow = {
        LicensePlate: req.body.licensePlate,
        Model: req.body.model,
        Manufacturer: req.body.manufacturer,
        YearManufactured: req.body.yearManufactured,
        Color: req.body.color,
        Engine: req.body.engine,
        Remarks: req.body.remarks
    };

    try {
        VehicleRepository.insert(vehicle)
            .then((result) => {
                if (result == undefined){
                    res.status(500).end();
                    return
                }
                res.json(makeVehicleView({...vehicle, id: result}));
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

const update = async (req: express.Request, res: express.Response) => {
    const vehicle : VehicleRow = {
        LicensePlate: req.body.licensePlate,
        Model: req.body.model,
        Manufacturer: req.body.manufacturer,
        YearManufactured: req.body.yearManufactured,
        Color: req.body.color,
        Engine: req.body.engine,
        Remarks: req.body.remarks
    };

    try {
        VehicleRepository.update(parseInt(req.query.id.toString()), vehicle)
            .then((result) => {
                if (result == undefined){
                    res.status(500).end();
                    return
                }
                res.json(makeVehicleView({...vehicle, id: result}));
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

const remove = (req: express.Request, res: express.Response) => {
    try {
        VehicleRepository.delete(parseInt(req.query.id.toString()))
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
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}

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

export default {all, id, create, update, remove, filter};