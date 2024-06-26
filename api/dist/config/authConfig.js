"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomRefreshSecret = exports.getRandomAccessSecret = exports.REFRESH_SECRETS = exports.ACCESS_SECRETS = exports.REFRESH_EXPIRE_TIME = exports.JWT_ISSUER = exports.JWT_EXPIRE_TIME = void 0;
const crypto_1 = require("crypto");
const JWT_KEY = "cYscIXvgwx1ELOvhp2Clr91GH4faJRSLhawlqjyw";
exports.JWT_EXPIRE_TIME = '10m';
exports.JWT_ISSUER = 'AutoWorks';
const REFRESH_KEY = "UgFJJqOrCPvSAkaq0GXF1y6UQkKa1TLvRAJSP08ZTlwdtm0tlzCfgcNsElpyw6rQGPp8ej";
exports.REFRESH_EXPIRE_TIME = '24h';
const refreshToken = {
    expireTime: exports.REFRESH_EXPIRE_TIME,
    secret: REFRESH_KEY
};
const token = {
    expireTime: exports.JWT_EXPIRE_TIME,
    issuer: exports.JWT_ISSUER,
    secret: JWT_KEY,
};
exports.default = { token, refreshToken };
exports.ACCESS_SECRETS = [
    "UDlQmDppTPdZBC9xmSW9j8Qo7BH3hZeDEP1qlIDAzljMpXfYfpyIsQoi5sKXFmx6",
    "eRJBt9CpqHilXpaXh01sEJzb5YELWp2v5ZO1SBZRp2MXpyD3hwTtHB9cVS99pk0u",
    "DHVH7mLMB6OyeWwxc5PlY1zhpzWUZBxH6CMZzbc0js2qsIlIDOFR4u693xjcTeii",
    "58oCXGdr1e4ctzpyIwtyfcP5F7sfCothpKgwhLObJRfDo6TPEMOUJaVBkkhvjK9G",
    "0dlr00Sv4KXaCL8zDpZvXiweGWAEYXZP0aRQqbfrc2hMB0dcuBScSTWVWYUPlc92"
];
exports.REFRESH_SECRETS = [
    "32ziXxriOkQ0GsjevwmCf6UbiJkLAwt76Xvm7MUZacC6do92vQpbiYqVPW5Xdfrp",
    "Ja90eTkqpWPh5Uta6Bo9Cvd7Ih9Lydmi3ueLRpp4PKFhgtVVDwuKauf2K1StG1GG",
    "GTXuSI4Kh6VtfA8uaMHoAizWIMLxB9S51xIR1WLrx1U3gtXX99GmTc6wcZFoZLvk",
    "fXrLqUdBATcW1LZdZWKZCZdC4dOw8Ih6Qhpd6k966ULKJWP6ZSpxtJEtyv4GkCHq",
    "atABWaHwTy77maouVitrOsdZHFKVjjXWSxLULa96YeyCkGpCOYRrJOURrTs1AimY"
];
const getRandomAccessSecret = () => {
    return exports.ACCESS_SECRETS[(0, crypto_1.randomInt)(exports.ACCESS_SECRETS.length)];
};
exports.getRandomAccessSecret = getRandomAccessSecret;
const getRandomRefreshSecret = () => {
    return exports.REFRESH_SECRETS[(0, crypto_1.randomInt)(exports.REFRESH_SECRETS.length)];
};
exports.getRandomRefreshSecret = getRandomRefreshSecret;
