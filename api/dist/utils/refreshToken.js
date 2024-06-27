"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const authConfig_1 = require("../config/authConfig");
const authValidation_1 = require("../middleware/authValidation");
const refreshToken = (refreshjwt) => {
    const decoded = (0, authValidation_1.checkRefreshToken)(refreshjwt);
    if (decoded) {
        return jwt.sign({
            id: decoded.id,
            role: decoded.role,
        }, (0, authConfig_1.getRandomRefreshSecret)(), {
            expiresIn: authConfig_1.JWT_EXPIRE_TIME,
            issuer: decoded.accessIssuer,
        });
    }
    return "";
};
exports.default = refreshToken;
