"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uid = require('uid-safe');
// We choose many secret keys which we can cycle through.
const SECRET_KEYS = [
    "U68PRKTQsaxcYG42Vj4vevTslIDm6hVk",
    "6CsOIELqwERMRJDfdfltQThQX7Nb9mIx",
    "zuUXTFML7WmA8MSG71eaxfAsKe7TJXVh",
    "wslO5KOGH8AP9TBeXTaTZ9VAETpmHqF2"
];
const sessionConfig = {
    secret: SECRET_KEYS,
    cookie: {
        maxAge: 86400000,
        secure: true,
        httpOnly: true,
        sameSite: "lax"
    },
    resave: false,
    saveUninitialized: false,
    name: "autoworks_s",
};
exports.default = sessionConfig;
