import { randomInt, randomUUID } from 'crypto';
import express = require('express');
import Bcrypt = require('bcryptjs');
import { CustomerRepository } from '../repository/customer';
import { UserRow } from '../models/user';
import { makeUserArrayView, makeUserView } from '../projections/user';
import { UserRepository } from '../repository/user';
import { Roles } from '../models/enum';

const SALT_ROUNDS = 10
const all = async (req: express.Request, res: express.Response) => {
    UserRepository.retrieveAll()
        .then((result) => {
            if (result.length == 0){
                res.status(500).end();
                return
            }
            console.log(result)
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
        let id = parseInt(req.query.id.toString())
        UserRepository.retrieveById(id)
            .then((result) => {
                if (result.length == 0){
                    res.status(500).end();
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

const register = async (req : express.Request, res : express.Response) => {
    const salt = Bcrypt.genSaltSync(SALT_ROUNDS)
    const user : UserRow= {
        FirstName : req.body.firstName,
        LastName : req.body.lastName,
        Username : req.body.username,
        MobileNumber : req.body.mobileNumber,
        Email : req.body.email,
        Salt: salt,
        Password : Bcrypt.hashSync(req.body.password, salt),
        Role : Roles.ADMIN
    }

    try {
        UserRepository.register(user)
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
        res.status(500).end();
    }

}

const update = async (req: express.Request, res: express.Response) => {
    const user : UserRow= {
        FirstName : req.body.firstName,
        LastName : req.body.lastName,
        Username : req.body.username,
        MobileNumber : req.body.mobileNumber,
        Email : req.body.email,
        Role : req.body.role
    }

    try {
        UserRepository.update(parseInt(req.query.id.toString()), user)
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
        UserRepository.delete(parseInt(req.query.id.toString()))
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

export default {all, id, register, update, remove};