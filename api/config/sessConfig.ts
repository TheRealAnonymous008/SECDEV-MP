import {SessionOptions } from "express-session";
var uid = require('uid-safe')

const sessionConfig : SessionOptions= {
    secret: 'your_secret_key_here',         // Note to change
    cookie: { 
      maxAge: 86400000, 
      secure: false,
      httpOnly: true,
      sameSite : "lax"
    },
    resave: false,
    saveUninitialized: false,
    name: "autoworks_s",
}

  export default sessionConfig;