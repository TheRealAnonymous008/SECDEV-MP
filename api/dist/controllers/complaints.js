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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const complaints_1 = require("../repository/complaints");
const logger_1 = __importDefault(require("../utils/logger"));
const logConfig_1 = require("../config/logConfig");
const inputValidation_1 = require("../middleware/inputValidation");
const complaints_2 = require("../projections/complaints");
const all = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        complaints_1.ComplaintsRepository.retrieveAll()
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield (0, complaints_2.makeComplaintArrayView)(result);
            res.json({
                data: data,
                count: result.length
            });
            res.status(200).end();
        }))
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving all complaints: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving all complaints: ${err.message}`);
        next(err);
    }
});
const id = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        complaints_1.ComplaintsRepository.retrieveById(id)
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (result === undefined) {
                res.status(404).end();
                return;
            }
            res.json(yield (0, complaints_2.makeComplaintView)(result));
            res.status(200).end();
        }))
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving complaint by id: ${err.message}`);
            next(err);
        });
    }
    catch (error) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error retrieving complaint by id: ${error.message}`);
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const complaint = {
            Description: (0, inputValidation_1.validateRequired)(req.body.Description, inputValidation_1.baseValidation),
            DateReported: (0, inputValidation_1.validateRequired)(req.body.DateReported, inputValidation_1.validateDate),
        };
        complaints_1.ComplaintsRepository.insert(complaint)
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (result === undefined) {
                throw new Error(`Failed to create complaint with params ${complaint}`);
            }
            res.json(yield (0, complaints_2.makeComplaintView)(Object.assign(Object.assign({}, complaint), { Id: result })));
            res.status(200).end();
        }))
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error creating complaint: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error creating complaint: ${err.message}`);
        next(err);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, inputValidation_1.validateRequired)(req.query.id.toString(), inputValidation_1.validateInteger);
        complaints_1.ComplaintsRepository.delete(id)
            .then((result) => {
            if (result === undefined) {
                throw new Error(`Failed to delete complaint with id ${id}`);
            }
            logger_1.default.log(logConfig_1.LogLevel.AUDIT, `Complaint deleted: ${id}`);
            res.status(200).end();
        })
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error deleting complaint with id ${id}: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error deleting complaint with id ${id}: ${err.message}`);
        next(err);
    }
});
const filter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = makeQuery(req);
        console.log("QUERY:", query);
        complaints_1.ComplaintsRepository.filter(query)
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            res.json({
                data: yield (0, complaints_2.makeComplaintArrayView)(result),
                count: result.length
            });
            res.status(200).end();
        }))
            .catch((err) => {
            logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error filtering complaints: ${err.message}`);
            next(err);
        });
    }
    catch (err) {
        logger_1.default.log(logConfig_1.LogLevel.ERRORS, `Error filtering complaints: ${err.message}`);
        next(err);
    }
});
const makeQuery = (req) => {
    const description = (0, inputValidation_1.validateOptional)(req.query.Description, inputValidation_1.baseValidation);
    const dateReported = (0, inputValidation_1.validateOptional)(req.query.DateReported, inputValidation_1.validateDate);
    const limit = (0, inputValidation_1.validateOptional)(req.query.limit, inputValidation_1.validateInteger);
    const skip = (0, inputValidation_1.validateOptional)(req.query.skip, inputValidation_1.validateInteger);
    return {
        Description: (description) ? description : null,
        DateReported: (dateReported) ? dateReported : null,
        limit: (limit) ? limit : null,
        skip: (skip) ? skip : null,
    };
};
exports.default = { all, id, create, remove, filter };
