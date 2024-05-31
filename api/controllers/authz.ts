import express = require('express');
import Bcrypt = require('bcryptjs');
import signToken from '../utils/signToken';
import { randomUUID } from 'crypto';
import { buildTransactionStatement, executeTransaction } from '../txn/transaction';
import { Roles } from '../models/enum';

const register = (req : express.Request, res : express.Response) => {
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

    executeTransaction([buildTransactionStatement(query, values)])
        .then((result) => {
            res.end();
        }).catch((err) => {
            console.log(err);
            res.end();
        })

}

export default {register}