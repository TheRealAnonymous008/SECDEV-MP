import { randomInt, randomUUID } from 'crypto';
import express = require('express');
import Bcrypt = require('bcryptjs');
import { CustomerRepository } from '../repository/customer';
import { UserRow } from '../models/user';
import { makeUserArrayView, makeUserView } from '../projections/user';
import { UserRepository } from '../repository/user';
import { RoleIds, Roles } from '../models/enum';
import { validateName, validateUsername, validateMobileNumber, validateEmail, validateInteger, validateImage, validateRole } from '../middleware/inputValidation';
import { Multer } from 'multer';

const SALT_ROUNDS = 10
const all = async (req: express.Request, res: express.Response) => {
    UserRepository.retrieveAll()
        .then((result) => {
            res.json({
                data: makeUserArrayView(result),
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
        let id = validateInteger(req.query.id.toString());
        UserRepository.retrieveById(id)
            .then((result) => {
                if (result.length == 0){
                    res.status(404).end();
                    return
                }
                res.json(makeUserView(result));
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

// req is any so thatwe can get all the files
const upload = async(req  :any, res: express.Response, next : express.NextFunction) => {
    try { 
        const file = validateImage(req.file as Express.Multer.File)
        const id = res.locals.jwt.id

        UserRepository.upload(id, file)
            .then((result) => 
                res.status(200).end()
        )

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
}

const update = async (req: express.Request, res: express.Response) => {
    try {
        const user : UserRow= {
            FirstName : validateName(req.body.firstName),
            LastName: validateName(req.body.lastName),
            Username : validateUsername(req.body.username),
            MobileNumber : validateMobileNumber(req.body.mobileNumber),
            Email : validateEmail(req.body.email),
            Role : validateRole(req.body.role)
        }
        let id = validateInteger(req.query.id.toString())

        UserRepository.update(id, user)
            .then((result) => {
                if (result == undefined){
                    res.status(500).end();
                    return
                }
                res.json(makeUserView({...user, id: result}));
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
        let id = validateInteger(req.query.id.toString());
        UserRepository.delete(id)
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
    }
    catch (err) {
        console.log(err);
        res.status(500);
    }
}

export default {all, id, upload, update, remove};