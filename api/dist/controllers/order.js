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
const customer_1 = require("../repository/customer");
const inputValidation_1 = require("../middleware/inputValidation");
const order_1 = require("../repository/order");
const order_2 = require("../projections/order");
const all = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    order_1.OrderRespository.retrieveAll()
        .then((result) => {
        res.json({
            data: (0, order_2.makeOrderArrayView)(result),
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
        customer_1.CustomerRepository.retrieveById(id)
            .then((result) => {
            if (result.length == 0) {
                res.status(404).end();
                return;
            }
            res.json((0, order_2.makeOrderView)(result));
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
// const create = async (req: express.Request, res: express.Response) => {
//     try {
//         const customer : CustomerRow = {
//             FirstName: validateName(req.body.firstName),
//             LastName: validateName(req.body.lastName),
//             MobileNumber: validateMobileNumber(req.body.mobileNumber),
//             Email: validateEmail(req.body.email),
//             Company: validateWord(req.body.company),
//             Insurance: validateWord(req.body.insurance),
//             Remarks: req.body.remarks               // This is a free field. SQL injection is prevented via prepared statements. XSS prevented by not accepting HTML
//         };
//         CustomerRepository.insert(customer)
//             .then((result) => {
//                 if (result == undefined){
//                     res.status(500).end();
//                     return
//                 }
//                 res.json(makeCustomerView({...customer, id: result}));
//                 res.status(200).end();
//             })
//             .catch((err) => {
//                 console.log(err);
//                 res.status(500).end();
//             })
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500);
//     }
// }
// const update = async (req: express.Request, res: express.Response) => {
//     try {
//         const customer : CustomerRow = {
//             FirstName: validateName(req.body.firstName),
//             LastName: validateName(req.body.lastName),
//             MobileNumber: validateMobileNumber(req.body.mobileNumber),
//             Email: validateEmail(req.body.email),
//             Company: validateWord(req.body.company),
//             Insurance: validateWord(req.body.insurance),
//             Remarks: req.body.remarks
//         };
//         let id = validateInteger(req.query.id.toString())
//         CustomerRepository.update(id, customer)
//             .then((result) => {
//                 if (result == undefined){
//                     res.status(500).end();
//                     return
//                 }
//                 res.json(makeCustomerView({...customer, id: result}));
//                 res.status(200).end();
//             })
//             .catch((err) => {
//                 console.log(err);
//                 res.status(500).end();
//             })
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500);
//     }
// }
// const remove = async (req: express.Request, res: express.Response) => {
//     try {
//         let id = validateInteger(req.query.id.toString())
//         CustomerRepository.delete(id)
//             .then((result) => {
//                 if (result == undefined){
//                     res.status(500).end();
//                     return
//                 }
//                 res.status(200).end();
//             })
//             .catch((err) => {
//                 console.log(err);
//                 res.status(500).end();
//             })
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500);
//     }
// }
exports.default = { all, id };
