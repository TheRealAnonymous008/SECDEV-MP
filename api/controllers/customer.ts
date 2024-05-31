import { randomUUID } from 'crypto';
import express = require('express');
import Bcrypt = require('bcryptjs');
import { Customer } from '../models/customer';
import { ALL_ROLES, Roles } from '../models/enum';
import { makeCustomerArrayView, makeCustomerView } from '../projections/customer';

// No SQL
/*
const all = async (req: express.Request, res: express.Response) => {
    const count = await Customer.countDocuments({});

    Customer.find({})
    .skip(parseInt(req.query.skip as string))
    .limit(parseInt(req.query.limit as string))
    .sort({$natural:-1})
    .then ((data) => {
        res.json({data: makeCustomerArrayView(data), count: count ? count : 0});
    })
}
*/

// SQL
const all = async (req: express.Request, res: express.Response) => {

    const query = `
        SELECT * FROM "Customer"
        LIMIT $1 OFFSET $2;
    `;

    const values = [
        req.query.limit,
        req.query.skip
    ];

    try {
        executeTransaction([buildTransactionStatement(query, values)], () => {res.status(500).end()})
            .then((result) => {
                res.json({data: makeCustomerArrayView(result), count: count ? count : 0});
            })
    }
    catch (err) {
        console.log(err);
        res.status(200)
    }
}

// No SQL
/*
const id = async (req: express.Request, res: express.Response) => {
    Customer.findOne({_id: req.query.id})
    .then((data) => {
        res.json(makeCustomerView(data));
    })
}
*/

// SQL
const id = async (req: express.Request, res: express.Response) => {

    const query = `
        SELECT * FROM "Customer" WHERE "Id" = $1
        RETURNING "Id";
    `;

    const values = [
        req.query.id
    ];

    try {
        executeTransaction([buildTransactionStatement(query, values)], () => {res.status(500).end()})
            .then((result) => {
                res.json(makeCustomerView(result));
            })
    }
    catch (err) {
        console.log(err);
        res.status(200)
    }
}

// No SQL
/*
const create = (req: express.Request, res: express.Response) => {
    const id = randomUUID()
    Customer.create({_id: id, ...req.body, })
        .then((result) => {
            console.log(result);
            res.json({...req.body, id: id});
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            res.end();
        });
}
*/

// SQL
const create = (req: express.Request, res: express.Response) => {
    const id = randomUUID()

    const query = `
        INSERT INTO "Customer" ("Id", "FirstName", "LastName", "MobileNumber", "Email", "Company", "Insurance", "Remarks")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING "Id";
    `;

    const values = [
        id,
        req.body.firstName,
        req.body.lastName,
        req.body.mobileNumber,
        req.body.email,
        req.body.company,
        req.body.insurance,
        req.body.remarks
    ];

    try {
        executeTransaction([buildTransactionStatement(query, values)], () => {res.status(500).end()})
            .then((result) => {
                res.json({...req.body, id: id});
            })
    }
    catch (err) {
        console.log(err);
        res.status(200)
    }
}

// No SQL
/*
const update = (req: express.Request, res: express.Response) => {
    Customer.updateOne({_id : req.query.id}, req.body, (error) => {
        if(error) {
            console.log(error);
            res.json(null);
        }
        else {
            res.json(req.body);
        }
    })
}
*/

// SQL
const update = (req: express.Request, res: express.Response) => {
    const query = `
        UPDATE "Customer" SET "FirstName" = $1, "LastName" = $2, "MobileNumber" = $3, "Email" = $4, "Company" = $5, "Insurance" = $6, "Remarks" = $7
        WHERE "Id" = $8
        RETURNING "Id";
    `;

    const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.mobileNumber,
        req.body.email,
        req.body.company,
        req.body.insurance,
        req.body.remarks,
        req.query.id
    ];

    try {
        executeTransaction([buildTransactionStatement(query, values)], () => {res.status(500).end()})
            .then((result) => {
                res.json(req.body);
            })
    }
    catch (err) {
        console.log(err);
        res.status(200)
    }

}

// No SQL
/*
const remove = (req : express.Request, res : express.Response) => {
    Customer.deleteOne({_id: req.query.id})
    .then ((result) => {
        res.end();
    })
    .catch((error) => {
        console.log(error);
        res.end();
    })
}
*/

// SQL
const remove = (req : express.Request, res : express.Response) => {

    const query = `
        DELETE FROM "Customer" WHERE "Id" = $1
        RETURNING "Id";
    `;

    const values = [
        req.query.id
    ];

    try {
        executeTransaction([buildTransactionStatement(query, values)], () => {res.status(500).end()})
            .then((result) => {
                res.end();
            })
    }
    catch (err) {
        console.log(err);
        res.status(200)
    }

}

// No SQL
/*
const filter = async (req: express.Request, res: express.Response) => {
    const query : CustomerQuery = makeQuery(req);
    const count = await getCount(query);

    Customer.aggregate([
        {
            $project : {
                "id": "$_id",
                "firstName": "$firstName",
                "lastName": "$lastName",
                "mobileNumber": "$mobileNumber",
                "email": "$email",
                "name" : { 
                    $concat : ["$firstName", " ", "$lastName"]
                },
                "company": "$company",
                "insurance": "$insurance",
                "remarks": "$remarks"
            }
        }
    ])
    .match(makeMongooseQuery(query))
    .skip(parseInt(req.query.skip as string))
    .limit(parseInt(req.query.limit as string))
    .then((result) => {
        res.json({data: makeCustomerArrayView(result), 
            count: (count && count[0] && count[0]["count"] ?  count[0]["count"] : 0)});
        res.end();
    }).catch((err) => {
        console.log(err);
        res.end();
    })
}
*/

// SQL
const filter = async (req: express.Request, res: express.Response) => {

    const query : CustomerQuery = makeQuery(req);
    const count = await getCount(query);

    const query = `
        SELECT * FROM "Customer"
        WHERE "FirstName" LIKE $1
        AND "LastName" LIKE $2
        AND "MobileNumber" LIKE $3
        AND "Email" LIKE $4
        AND "Company" LIKE $5
        AND "Insurance" LIKE $6
        AND "Remarks" LIKE $7
        LIMIT $8 OFFSET $9;
    `;

    const values = [
        query.name,
        query.email,
        query.mobileNumber,
        query.company,
        query.insurance,
        query.remarks,
        req.query.limit,
        req.query.skip
    ];

    try {
        executeTransaction([buildTransactionStatement(query, values)], () => {res.status(500).end()})
            .then((result) => {
                res.json({data: makeCustomerArrayView(result), 
                    count: (count && count[0] && count[0]["count"] ?  count[0]["count"] : 0)});
                res.end();
            })
    }
    catch (err) {
        console.log(err);
        res.status(200)
    }
}

// No SQL
/*
const getCount = async (query) => {
    return await Customer.aggregate([
        {
            $project : {
                "id": "$_id",
                "firstName": "$firstName",
                "lastName": "$lastName",
                "mobileNumber": "$mobileNumber",
                "email": "$email",
                "name" : { 
                    $concat : ["$firstName", " ", "$lastName"]
                },
                "company": "$company",
                "insurance": "$insurance",
                "remarks": "$remarks"
            }
        }
    ])
    .match(makeMongooseQuery(query))
    .count("count")
}
*/

// SQL
const getCount = async (query) => {
    const query = `
        SELECT COUNT(*) FROM "Customer"
        WHERE "FirstName" LIKE $1
        AND "LastName" LIKE $2
        AND "MobileNumber" LIKE $3
        AND "Email" LIKE $4
        AND "Company" LIKE $5
        AND "Insurance" LIKE $6
        AND "Remarks" LIKE $7;
    `;

    const values = [
        query.name,
        query.email,
        query.mobileNumber,
        query.company,
        query.insurance,
        query.remarks
    ];

    try {
        return await executeTransaction([buildTransactionStatement(query, values)], () => {res.status(500).end()})
    }
    catch (err) {
        console.log(err);
        res.status(200)
    }

}

interface CustomerQuery {
    name : string,
    email: string,
    mobileNumber: string,
    company: string,
    insurance: string,
    remarks: string
}

const makeMongooseQuery = (q : CustomerQuery) : any => {
    let query =  {
        name: {$regex: ".*" + q.name + ".*" , $options: "i"},
        email: {$regex: ".*" + q.email + ".*" , $options: "i"},
        mobileNumber: {$regex: ".*" + q.mobileNumber + ".*" , $options: "i"},
        company: {$regex: ".*" + q.company + ".*" , $options: "i"},
        insurance: {$regex: ".*" + q.insurance + ".*" , $options: "i"},
        remarks: {$regex: ".*" + q.remarks + ".*" , $options: "i"}
    }

    return query;
}

const makeQuery = (req : express.Request) : CustomerQuery => {
    return {
        name: (req.query.name) ? (req.query.name as string) : "",
        email: (req.query.email) ? (req.query.email as string) : "",
        mobileNumber: (req.query.mobileNumber) ? (req.query.mobileNumber as string) : "",
        company: (req.query.company) ? (req.query.company as string) : "",
        insurance: (req.query.insurance) ? (req.query.insurance as string) : "",
        remarks: (req.query.remarks) ? (req.query.remarks as string) : ""
    }
}

export default {all, id, create, update, remove, filter};