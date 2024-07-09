import express = require('express');
import { UserRow } from '../models/user';
import { makeUserArrayView, makeUserView } from '../projections/user';
import { UserQuery, UserRepository } from '../repository/user';
import { validateName, validateUsername, validateMobileNumber, validateEmail, validateInteger, validateImage, validateRole, baseValidation, validateLimit } from '../middleware/inputValidation';

const all = (req: express.Request, res: express.Response) => {
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

const id = (req: express.Request, res: express.Response) => {
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
        const file = await validateImage(req.file as Express.Multer.File)
        const id = res.locals.jwt.id

        UserRepository.upload(id, file)
            .then((result) => 
                res.status(200).end())
            .catch((err) => {
                console.log(err)
                res.status(500).end()
            })

    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
}

const update = (req: express.Request, res: express.Response) => {
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


const filter = async (req: express.Request, res: express.Response) => {
    try {
        const query = makeQuery(req)
        UserRepository.filter(query)
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
    catch (err) {
        console.log(err);
        res.status(500);
    }
}

const makeQuery = (req : express.Request) : UserQuery => {
    const name = baseValidation(req.query.name)
    const username = baseValidation(req.query.username)
    const email = baseValidation(req.query.email)
    const mobileNumber = baseValidation(req.query.mobileNumber)
    const role = baseValidation(req.query.role)
    const limit = validateLimit(req.query.limit)
    const skip = baseValidation(req.query.skip)

    return {
        name: (name) ? (name as string) : null,
        username : (username) ? (username as string) : null,
        email: (email) ? (email as string) : null,
        mobileNumber: (mobileNumber) ? (mobileNumber as string) : null,
        role: (role)? (role as string) : null,
        limit: (limit) ? (limit as number) : null,
        skip: (skip) ? (skip as number) : null,
    }
}

export default {all, id, upload, update, remove, filter};