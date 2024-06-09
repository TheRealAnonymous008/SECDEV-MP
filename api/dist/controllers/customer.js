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
const inputValidation_1 = require("../middleware/inputValidation");
const all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    customer_2.CustomerRepository.retrieveAll()
        .then((result) => {
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
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        customer_2.CustomerRepository.retrieveById(id)
            .then((result) => {
            if (result.length == 0) {
                res.status(404).end();
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
    try {
        const customer = {
            FirstName: (0, inputValidation_1.validateName)(req.body.firstName),
            LastName: (0, inputValidation_1.validateName)(req.body.lastName),
            MobileNumber: (0, inputValidation_1.validateMobileNumber)(req.body.mobileNumber),
            Email: (0, inputValidation_1.validateEmail)(req.body.email),
            Company: (0, inputValidation_1.validateWord)(req.body.company),
            Insurance: (0, inputValidation_1.validateWord)(req.body.insurance),
            Remarks: req.body.remarks // This is a free field. SQL injection is prevented via prepared statements. XSS prevented by not accepting HTML
        };
        customer_2.CustomerRepository.insert(customer)
            .then((result) => {
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
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = {
            FirstName: (0, inputValidation_1.validateName)(req.body.firstName),
            LastName: (0, inputValidation_1.validateName)(req.body.lastName),
            MobileNumber: (0, inputValidation_1.validateMobileNumber)(req.body.mobileNumber),
            Email: (0, inputValidation_1.validateEmail)(req.body.email),
            Company: (0, inputValidation_1.validateWord)(req.body.company),
            Insurance: (0, inputValidation_1.validateWord)(req.body.insurance),
            Remarks: req.body.remarks
        };
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        customer_2.CustomerRepository.update(id, customer)
            .then((result) => {
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
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateInteger)(req.query.id.toString());
        customer_2.CustomerRepository.delete(id)
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
        res.status(500);
    }
});
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
exports.default = { all, id, create, update, remove };
