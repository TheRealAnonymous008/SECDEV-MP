import express = require('express');
import Bcrypt = require('bcryptjs');
import signToken from '../utils/signToken';
import { randomUUID } from 'crypto';
import { Roles } from '../models/enum';
import { UserRepository } from '../repository/user';
import { UserRow } from '../models/user';

const SALT_ROUNDS = 10

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


const verify = async (req : express.Request, res : express.Response) => {
    try {
        UserRepository.verifyRole(req.body.username, req.body.role)
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

const login = async (req : express.Request, res : express.Response) => {
    UserRepository.retrieveByUsername(req.body.username)
    .then((user) => {
        if (user) {
            Bcrypt.compare(req.body.password, user.Password, (error, result) => {
                if(!result) {
                    res.json({
                        auth : false,
                        message : "Username and Password do not match!"
                    }).end()
                } 
                else if (result) {
                    signToken(user, (err, token, refreshToken) => {
                        if (err) {
                            res.status(500).json({
                                auth : false,
                                message : err.message,
                                error : err,
                            }).end()
                        }
                        else if (token) {
                            if(refreshToken) {
                                res.cookie('jwt', refreshToken, 
                                {
                                    httpOnly:true,
                                    secure: true,
                                    sameSite: "lax",
                                })
                                res.cookie('jwtacc', token, 
                                {
                                    httpOnly: false,
                                    secure: true,
                                    sameSite: "lax",
                                })
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
                        message : "Password Input Failure",
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
        .status(500)
        .end();
    });
}


const logout = (req : express.Request, res : express.Response) => {
    res.clearCookie("jwt").clearCookie("jwtacc").end();
}


export default {register, login, logout, verify}