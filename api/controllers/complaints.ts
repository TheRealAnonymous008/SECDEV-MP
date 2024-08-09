import express = require('express');
import Complaint, { ComplaintRow } from '../models/complaints';
import { ComplaintQuery, ComplaintsRepository } from '../repository/complaints';
import logger from '../utils/logger';
import { LogLevel } from '../config/logConfig';
import { validateRequired, validateWord, validateDate, validateInteger, validateOptional, baseValidation } from '../middleware/inputValidation';
import { makeComplaintView, makeComplaintArrayView } from '../projections/complaints';

const all = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        ComplaintsRepository.retrieveAll()
            .then(async (result) => {
                const data = await makeComplaintArrayView(result);
                res.json({
                    data: data,
                    count: result.length
                });
                logger.log(LogLevel.AUDIT, `Retrieved all complaints`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error retrieving all complaints: ${err.message}`);
                next(err);
            });
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error retrieving all complaints: ${err.message}`);
        next(err);
    }
};

const id = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let id = validateRequired(req.query.id.toString(), validateInteger);
        ComplaintsRepository.retrieveById(id)
            .then(async (result) => {
                if (result === undefined) {
                    logger.log(LogLevel.DEBUG, `Complaint not found: ${id}`);
                    res.status(404).end();
                    return;
                }
                res.json(await makeComplaintView(result));
                logger.log(LogLevel.AUDIT, `Complaint retrieved: ${id}`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error retrieving complaint by id: ${err.message}`);
                next(err);
            });
    } catch (error) {
        logger.log(LogLevel.ERRORS, `Error retrieving complaint by id: ${error.message}`);
        next(error);
    }
};

const create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const complaint: ComplaintRow = {
            Description: validateRequired(req.body.Description, baseValidation),
            DateReported: validateRequired(req.body.DateReported, validateDate),
        };

        ComplaintsRepository.insert(complaint)
            .then(async (result) => {
                if (result === undefined) {
                    logger.log(LogLevel.ERRORS, `Failed to create complaint with params ${complaint}`);
                    throw new Error(`Failed to create complaint with params ${complaint}`);
                }
                res.json(await makeComplaintView({ ...complaint, Id: result }));
                logger.log(LogLevel.AUDIT, `Complaint created: ${result}`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error creating complaint: ${err.message}`);
                next(err);
            });
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error creating complaint: ${err.message}`);
        next(err);
    }
};

const remove = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let id = validateRequired(req.query.id.toString(), validateInteger);

        ComplaintsRepository.delete(id)
            .then((result) => {
                if (result === undefined) {
                    throw new Error(`Failed to delete complaint with id ${id}`);
                }
                logger.log(LogLevel.AUDIT, `Complaint deleted: ${id}`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error deleting complaint with id ${id}: ${err.message}`);
                next(err);
            });
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error deleting complaint with id ${id}: ${err.message}`);
        next(err);
    }
};

const filter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const query = makeQuery(req);
        ComplaintsRepository.filter(query)
            .then(async (result) => {
                res.json({
                    data: await makeComplaintArrayView(result),
                    count: result.length
                });
                logger.log(LogLevel.AUDIT, `Filtered complaints`);
                res.status(200).end();
            })
            .catch((err) => {
                logger.log(LogLevel.ERRORS, `Error filtering complaints: ${err.message}`);
                next(err);
            });
    } catch (err) {
        logger.log(LogLevel.ERRORS, `Error filtering complaints: ${err.message}`);
        next(err);
    }
};

const makeQuery = (req: express.Request): ComplaintQuery => {
    const description = validateOptional(req.query.Description, baseValidation);
    const dateReported = validateOptional(req.query.DateReported, validateDate);
    const limit = validateOptional(req.query.limit, validateInteger);
    const skip = validateOptional(req.query.skip, validateInteger);

    return {
        Description: (description) ? (description as string) : null,
        DateReported: (dateReported) ? (dateReported as string) : null,
        limit: (limit) ? (limit as number) : null,
        skip: (skip) ? (skip as number) : null,
    };
}

export default { all, id, create, remove, filter };
