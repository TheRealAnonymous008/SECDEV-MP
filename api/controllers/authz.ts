import express = require('express');
import Bcrypt = require('bcryptjs');
import { RoleIds } from '../models/enum';
import { UserRepository } from '../repository/user';
import { UserRow } from '../models/user';
import * as inputValidation from '../middleware/inputValidation';
import jwtDecode from 'jwt-decode';
import logger from '../utils/logger';
import { LogLevel } from '../config/logConfig';
import { initializeSession, signToken } from '../utils/tokenUtils';
import { COOKIE_SETTINGS } from '../config/authConfig';

const SALT_ROUNDS = 14

const register = (req : express.Request, res : express.Response, next: express.NextFunction) => {
    try {
        const salt = Bcrypt.genSaltSync(SALT_ROUNDS)
        const password = inputValidation.validatePassword(req.body.password)
        const user : UserRow= {
            FirstName : inputValidation.validateName(req.body.firstName),
            LastName : inputValidation.validateName(req.body.lastName),
            Username : inputValidation.validateUsername(req.body.username),
            MobileNumber : inputValidation.validateMobileNumber(req.body.mobileNumber),
            Email : inputValidation.validateEmail(req.body.email),
            Salt: salt,
            Password : Bcrypt.hashSync(password, salt),
            Role : RoleIds.VIEW
        }
        
        UserRepository.register(user)
            .then((result) => {
                if (result == undefined){
                    throw new Error(`Failed to register user ${user.Username}`)
                }
                res.status(200).end();
            })
            .catch((err) => {
                next(err)
            })
    }
    catch (err) {
        next(err)
    }

}

const login = (req : express.Request, res : express.Response, next: express.NextFunction) => {
    try {
        let username = inputValidation.validateUsername(req.body.username)

        UserRepository.retrieveByUsername(username)
        .then((user) => {
            if (user) {
                Bcrypt.compare(req.body.password, user.Password, async (error, result) => {
                    if(!result) {
                        res.json({
                            auth : false,
                            message : "Username and Password do not match!"
                        }).end()
                    } 
                    else if (result) {
                        const data = await initializeSession(user)
                        await signToken(data, (err, token, refreshToken) => {
                            if (err) {
                                res.json({
                                    auth : false,
                                    message : err.message,
                                    error : err,
                                })
                                next(err)
                            }
                            else if (token) {
                                if(refreshToken) {
                                    res = res.cookie('jwt', refreshToken, COOKIE_SETTINGS)
                                    res.cookie('jwtacc', token, COOKIE_SETTINGS)
                                    res.cookie('csrf', data.csrf, COOKIE_SETTINGS)
                                    res.json({
                                        auth : true,
                                        message : "Authenticated",
                                        token: token,
                                        success : true,
                                    }).status(200).end();
                                }   
                            }
                        });
                    }
                    else if(error) {
                        res.json({
                            auth : false,
                            message : "Username and Password do not match",
                        }).end()
                    }
                });
            } 
            else {
                res.json({
                    auth : false, 
                    error : "Username and Password do not match",
                }).end()
            }
        })
        .catch((error) => {
            res.json({
                auth : false, 
                error : error
            })
            next(error)
        });
    }
    catch (err) {
        next(err)
    }
}

const handshake = (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
        const sessionId = res.locals.jwt.id
        
        UserRepository.getUserFromSession(sessionId)
            .then((value) => {
                if (value)
                    res.json(value).end();
                else {
                    res.json(undefined).end()
                }
            })
            .catch((err) => {
                next(err)
            })
    }
    catch (err) {
        next(err)
    }
}

const logout = (req : express.Request, res : express.Response, next: express.NextFunction) => {
    try {
        const token = req.cookies.jwt
        const sessionId : any = jwtDecode(token)["id"]
        UserRepository
            .deleteSession(sessionId)
            .then((v) => {
                res.clearCookie("jwt")
                    .clearCookie("jwtacc")
                    .clearCookie("csrf")
                    .end();
            })
            .catch((err) => {
                next(err)
            });
        
    } catch(err) {
        next(err)
    }
}


export default {register, login, logout, handshake}