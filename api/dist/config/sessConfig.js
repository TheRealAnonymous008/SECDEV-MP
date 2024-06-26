"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uid = require('uid-safe');
const sessionConfig = {
    secret: 'your_secret_key_here',
    cookie: {
        maxAge: 86400000,
        secure: false,
        httpOnly: true,
        sameSite: "lax"
    },
    resave: false,
    saveUninitialized: false,
    name: "autoworks_s",
};
exports.default = sessionConfig;
