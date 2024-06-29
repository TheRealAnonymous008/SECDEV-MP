"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_EXPIRE_TIME = exports.getRandomRefreshSecret = exports.getRandomAccessSecret = exports.REFRESH_SECRETS = exports.ACCESS_SECRETS = exports.REFRESH_EXPIRE_TIME = exports.JWT_ISSUER = exports.JWT_EXPIRE_TIME = void 0;
const crypto_1 = require("crypto");
exports.JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;
exports.JWT_ISSUER = process.env.JWT_ISSUER;
exports.REFRESH_EXPIRE_TIME = process.env.REFRESH_EXPIRE_TIME;
exports.ACCESS_SECRETS = JSON.parse(process.env.ACCESS_SECRETS);
exports.REFRESH_SECRETS = JSON.parse(process.env.REFRESH_SECRETS);
const getRandomAccessSecret = () => {
    return exports.ACCESS_SECRETS[(0, crypto_1.randomInt)(exports.ACCESS_SECRETS.length)];
};
exports.getRandomAccessSecret = getRandomAccessSecret;
const getRandomRefreshSecret = () => {
    return exports.REFRESH_SECRETS[(0, crypto_1.randomInt)(exports.REFRESH_SECRETS.length)];
};
exports.getRandomRefreshSecret = getRandomRefreshSecret;
exports.SESSION_EXPIRE_TIME = parseInt(process.env.SESSION_EXPIRE_TIME);
