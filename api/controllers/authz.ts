import express = require('express');
import Bcrypt = require('bcryptjs');
import signToken from '../utils/signToken';
import { randomUUID } from 'crypto';
import { buildTransactionStatement, executeTransaction } from '../txn/transaction';
import { Roles } from '../models/enum';

const register = async (req : express.Request, res : express.Response) => {
    const user = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        username : req.body.username,
        mobileNumber : req.body.mobileNumber,
        email : req.body.email,
        password : Bcrypt.hashSync(req.body.password, 10),
        role : Roles.ADMIN
    }

    const query = `
      INSERT INTO "Users" ("FirstName", "LastName", "Username", "Password", "Role", "MobileNumber", "Email")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING "Id";
    `;

    const values = [
      user.firstName,
      user.lastName,
      user.username,
      user.password, 
      user.role,
      user.mobileNumber,
      user.email,
    ];

    try {
        executeTransaction([
            buildTransactionStatement(query, values)], () => {
            res.status(200);
        })
            .then((result) => {
                console.log(result);
            })
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }

}

// const login = (req : express.Request, res : express.Response) => {
//     User.findOne({username : req.body.username})
//     .then((user) => {
//         if (user) {
//             Bcrypt.compare(req.body.password, user.password, (error, result) => {
//                 if(!result) {
//                     return res.json({
//                         auth : false,
//                         message : "Incorrect Password!"
//                     }).end()
//                 } 
//                 else if (result) {
//                     signToken(user, (err, token, refreshToken) => {
//                         if (err) {
//                             return res.status(500).json({
//                                 auth : false,
//                                 message : err.message,
//                                 error : err,
//                             })
//                         }
//                         else if (token) {
//                             if(refreshToken) {
//                                 res.cookie('jwt', refreshToken, 
//                                 {
//                                     httpOnly:true,
//                                     secure: true,
//                                     sameSite: "none",
//                                 })
//                                 res.cookie('jwtacc', token, 
//                                 {
//                                     httpOnly: false,
//                                     secure: true,
//                                     sameSite: "none",
//                                 })
//                                 return res.status(200).json({
//                                     auth : true,
//                                     message : "Authenticated",
//                                     token: token,
//                                     success : true,
//                                 });
//                             }   
//                         }
//                     });
//                 }
//                 else if(error) {
//                     return res.json({
//                         auth : false,
//                         message : "Password Input Failure",
//                     }).end()
//                 }
//             });
//         } 
//         else {
//             res.json({
//                 auth : false, 
//                 error : "User does not exist",
//             }).end()
//         }
//     })
//     .catch((error) => {
//         res.sendStatus(500).json({
//             auth : false, 
//             error : error
//         });
//     });
// }


const login = async (req : express.Request, res : express.Response) => {
    const userId = await findUser(req.body.username)
    console.log(userId)
}

const findUser = async (username : string) => {
    const query = `
    SELECT "Id" FROM "Users" WHERE "Username" = $1
    `;

    const values = [username]

    try {
        const val = executeTransaction([buildTransactionStatement(query, values)], () => {throw Error()})
            .then((result) => {
                const rows = result[0].rows;
                if(rows.length == 0)
                    return -1;

                return rows[0];
            })

        return val;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}


const logout = (req : express.Request, res : express.Response) => {
    res.clearCookie("jwt").clearCookie("jwtacc").end();
}


export default {register, login, logout}