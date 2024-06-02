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
const customer_1 = require("../projections/customer");
const customer_2 = require("../repository/customer");
const all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    customer_2.CustomerRepository.retrieveAll()
        .then((result) => {
        if (result.length == 0) {
            res.status(500).end();
            return;
        }
        res.json({
            data: (0, customer_1.makeCustomerArrayView)(result),
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
        customer_2.CustomerRepository.retieveById(id)
            .then((result) => {
            if (result.length == 0) {
                res.status(500).end();
                return;
            }
            res.json((0, customer_1.makeCustomerView)(result));
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
    const customer = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        company: req.body.company,
        insurance: req.body.insurance,
        remarks: req.body.remarks
    };
    try {
        customer_2.CustomerRepository.insert(customer)
            .then((result) => {
            console.log(result);
            if (result == undefined) {
                res.status(500).end();
                return;
            }
            res.json((0, customer_1.makeCustomerView)(Object.assign(Object.assign({}, customer), { id: result })));
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
// const update = async (req: express.Request, res: express.Response) => {
//     const query = `
//         UPDATE "Customer" SET "FirstName" = $1, "LastName" = $2, "MobileNumber" = $3, "Email" = $4, "Company" = $5, "Insurance" = $6, "Remarks" = $7
//         WHERE "Id" = $8
//         RETURNING "Id";
//     `;
//     const values = [
//         req.body.firstName,
//         req.body.lastName,
//         req.body.mobileNumber,
//         req.body.email,
//         req.body.company,
//         req.body.insurance,
//         req.body.remarks,
//         req.query.id
//     ];
//     try {
//         executeTransaction([buildTransactionStatement(query, values)], () => {res.status(500).end()})
//             .then((result) => {
//                 res.status(200).json(req.body);
//             })
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500);
//     }
// }
// const remove = async (req : express.Request, res : express.Response) => {
//     const query = `
//         DELETE FROM "Customer" WHERE "Id" = $1
//         RETURNING "Id";
//     `;
//     const values = [
//         req.query.id
//     ];
//     try {
//         executeTransaction([buildTransactionStatement(query, values)], () => {res.status(500).end()})
//             .then((result) => {
//                 res.status(200);
//             })
//     }
//     catch (err) {
//         console.log(err);
//         res.status(200)
//     }
// }
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
exports.default = { all, id, create };
