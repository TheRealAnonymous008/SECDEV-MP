import express = require('express');
import Bcrypt = require('bcryptjs');
import signToken from '../utils/signToken';
import { RoleIds, Roles } from '../models/enum';
import { UserRepository } from '../repository/user';
import { UserRow } from '../models/user';
import * as inputValidation from '../middleware/inputValidation';
import jwtDecode from 'jwt-decode';
import { CookieOptions } from 'express-serve-static-core';

const SALT_ROUNDS = 14

const register = async (req : express.Request, res : express.Response) => {
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
    try {
        let username = inputValidation.validateUsername(req.body.username)

        UserRepository.retrieveByUsername(username)
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
                        req.session.regenerate((err) => {
                            if (err) throw err

                            const session : any = req.session
                            session.uid = user.Id
                            session.save()
                        })
                        

                        // res.cookie("autoworks_s", req.session.id, req.session.cookie as CookieOptions)
                        res.json({
                            auth: true, 
                        }).status(200).end()

                        // await signToken(user, (err, token, refreshToken) => {
                        //     if (err) {
                        //         console.log(err)
                        //         res.status(500).json({
                        //             auth : false,
                        //             message : err.message,
                        //             error : err,
                        //         }).end()
                        //     }
                        //     else if (token) {
                        //         if(refreshToken) {
                        //             res = res.cookie('jwt', refreshToken, 
                        //             {
                        //                 httpOnly:true,
                        //                 secure: true,
                        //                 sameSite: "lax",
                        //             })
                        //             res.cookie('jwtacc', token, 
                        //             {
                        //                 httpOnly: true,
                        //                 secure: true,
                        //                 sameSite: "lax",
                        //             })
                        //             res.json({
                        //                 auth : true,
                        //                 message : "Authenticated",
                        //                 token: token,
                        //                 success : true,
                        //             }).status(200).end();
                        //         }   
                        //     }
                        // });
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
    catch (err) {
        console.log(err)
        res.status(500).end();
    }
}

const handshake = (req : express.Request, res : express.Response) => {
    try {
        console.log("Shake hands" ,req.session)
        const uid = req.session["uid"]
        if (uid == null){
            res.status(500).end()
        } else {
        UserRepository.retrieveById(uid)
            .then((value) => {
                if (value)
                    res.json(value).end();
                else {
                    res.json(undefined).end()
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(500).end();
            })
        
        // UserRepository.getUserFromSession(sessionId)
        //     .then((value) => {
        //         if (value)
        //             res.json(value).end();
        //         else {
        //             res.json(undefined).end()
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //         res.status(500).end();
        //     })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).end();
    }
}

const logout = async (req : express.Request, res : express.Response) => {
    // const token = req.cookies.jwt
    // const sessionId : any = jwtDecode(token)["id"]
    // await UserRepository.deleteSession(sessionId);
    // res.clearCookie("jwt").clearCookie("jwtacc").end();
    req.session.destroy((err) => {console.log(err)})
    res.clearCookie("autoworks_s").end()
}


export default {register, login, logout, handshake}