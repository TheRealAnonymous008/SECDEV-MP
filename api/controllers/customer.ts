import { randomInt, randomUUID } from 'crypto';
import express = require('express');
import Bcrypt = require('bcryptjs');
import { ALL_ROLES, Roles } from '../models/enum';
import { makeCustomerArrayView, makeCustomerView } from '../projections/customer';
import { CustomerRepository } from '../repository/customer';
import Customer, { CustomerRow } from '../models/customer';

const all = async (req: express.Request, res: express.Response) => {
    CustomerRepository.retrieveAll()
        .then((result) => {
            if (result.length == 0){
                res.status(500).end();
                return
            }
            res.json({
                data: makeCustomerArrayView(result),
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
        CustomerRepository.retieveById(id)
            .then((result) => {
                if (result.length == 0){
                    res.status(500).end();
                    return
                }
                res.json(makeCustomerView(result));
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
    const customer : CustomerRow = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        company: req.body.company,
        insurance: req.body.insurance,
        remarks: req.body.remarks
    };

    try {
        CustomerRepository.insert(customer)
            .then((result) => {
                console.log(result)
                if (result == undefined){
                    res.status(500).end();
                    return
                }
                res.json(makeCustomerView({...customer, id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                        
                console.log(err);
                res.status(500).end();
            })
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
}

const update = async (req: express.Request, res: express.Response) => {
    const customer : CustomerRow = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        company: req.body.company,
        insurance: req.body.insurance,
        remarks: req.body.remarks
    };

    try {
        CustomerRepository.update(parseInt(req.query.id.toString()), customer)
            .then((result) => {
                console.log(result)
                if (result == undefined){
                    res.status(500).end();
                    return
                }
                res.json(makeCustomerView({...customer, id: result}));
                res.status(200).end();
            })
            .catch((err) => {
                        
                console.log(err);
                res.status(500).end();
            })
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
}

const remove = async (req: express.Request, res: express.Response) => {
    try {
        CustomerRepository.delete(parseInt(req.query.id.toString()))
            .then((result) => {
                console.log(result)
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
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
}

// // No SQL
// /*
// const filter = async (req: express.Request, res: express.Response) => {
//     const query : CustomerQuery = makeQuery(req);
//     const count = await getCount(query);

//     Customer.aggregate([
//         {
//             $project : {
//                 "id": "$_id",
//                 "firstName": "$firstName",
//                 "lastName": "$lastName",
//                 "mobileNumber": "$mobileNumber",
//                 "email": "$email",
//                 "name" : { 
//                     $concat : ["$firstName", " ", "$lastName"]
//                 },
//                 "company": "$company",
//                 "insurance": "$insurance",
//                 "remarks": "$remarks"
//             }
//         }
//     ])
//     .match(makeMongooseQuery(query))
//     .skip(parseInt(req.query.skip as string))
//     .limit(parseInt(req.query.limit as string))
//     .then((result) => {
//         res.json({data: makeCustomerArrayView(result), 
//             count: (count && count[0] && count[0]["count"] ?  count[0]["count"] : 0)});
//         res.end();
//     }).catch((err) => {
//         console.log(err);
//         res.end();
//     })
// }
// */

// // SQL
// const filter = async (req: express.Request, res: express.Response) => {

//     const query : CustomerQuery = makeQuery(req);
//     const count = await getCount(query);

//     const query = `
//         SELECT * FROM "Customer"
//         WHERE "FirstName" LIKE $1
//         AND "LastName" LIKE $2
//         AND "MobileNumber" LIKE $3
//         AND "Email" LIKE $4
//         AND "Company" LIKE $5
//         AND "Insurance" LIKE $6
//         AND "Remarks" LIKE $7
//         LIMIT $8 OFFSET $9;
//     `;

//     const values = [
//         query.name,
//         query.email,
//         query.mobileNumber,
//         query.company,
//         query.insurance,
//         query.remarks,
//         req.query.limit,
//         req.query.skip
//     ];

//     try {
//         executeTransaction([buildTransactionStatement(query, values)], () => {res.status(500).end()})
//             .then((result) => {
//                 res.json({data: makeCustomerArrayView(result), 
//                     count: (count && count[0] && count[0]["count"] ?  count[0]["count"] : 0)});
//                 res.end();
//             })
//     }
//     catch (err) {
//         console.log(err);

//         res.status(200)
//     }
// }

// // No SQL
// /*
// const getCount = async (query) => {
//     return await Customer.aggregate([
//         {
//             $project : {
//                 "id": "$_id",
//                 "firstName": "$firstName",
//                 "lastName": "$lastName",
//                 "mobileNumber": "$mobileNumber",
//                 "email": "$email",
//                 "name" : { 
//                     $concat : ["$firstName", " ", "$lastName"]
//                 },
//                 "company": "$company",
//                 "insurance": "$insurance",
//                 "remarks": "$remarks"
//             }
//         }
//     ])
//     .match(makeMongooseQuery(query))
//     .count("count")
// }
// */

// // SQL
// const getCount = async (query) => {
//     const query = `
//         SELECT COUNT(*) FROM "Customer"
//         WHERE "FirstName" LIKE $1
//         AND "LastName" LIKE $2
//         AND "MobileNumber" LIKE $3
//         AND "Email" LIKE $4
//         AND "Company" LIKE $5
//         AND "Insurance" LIKE $6
//         AND "Remarks" LIKE $7;
//     `;

//     const values = [
//         query.name,
//         query.email,
//         query.mobileNumber,
//         query.company,
//         query.insurance,
//         query.remarks
//     ];

//     try {
//         return await executeTransaction([buildTransactionStatement(query, values)], () => {res.status(500).end()})
//     }
//     catch (err) {
//         console.log(err);
//         res.status(200)
//     }

// }

// interface CustomerQuery {
//     name : string,
//     email: string,
//     mobileNumber: string,
//     company: string,
//     insurance: string,
//     remarks: string
// }

// const makeMongooseQuery = (q : CustomerQuery) : any => {
//     let query =  {
//         name: {$regex: ".*" + q.name + ".*" , $options: "i"},
//         email: {$regex: ".*" + q.email + ".*" , $options: "i"},
//         mobileNumber: {$regex: ".*" + q.mobileNumber + ".*" , $options: "i"},
//         company: {$regex: ".*" + q.company + ".*" , $options: "i"},
//         insurance: {$regex: ".*" + q.insurance + ".*" , $options: "i"},
//         remarks: {$regex: ".*" + q.remarks + ".*" , $options: "i"}
//     }

//     return query;
// }

// const makeQuery = (req : express.Request) : CustomerQuery => {
//     return {
//         name: (req.query.name) ? (req.query.name as string) : "",
//         email: (req.query.email) ? (req.query.email as string) : "",
//         mobileNumber: (req.query.mobileNumber) ? (req.query.mobileNumber as string) : "",
//         company: (req.query.company) ? (req.query.company as string) : "",
//         insurance: (req.query.insurance) ? (req.query.insurance as string) : "",
//         remarks: (req.query.remarks) ? (req.query.remarks as string) : ""
//     }
// }

export default {all, id, create, update, remove};