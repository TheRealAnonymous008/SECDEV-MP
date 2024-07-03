"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImage = exports.assertNotNullOrEmpty = exports.validateLicensePlate = exports.validateRole = exports.validatePassword = exports.validateLimit = exports.validateInteger = exports.validateMobileNumber = exports.validateUsername = exports.validateWord = exports.validateName = exports.validateEmail = exports.baseValidation = exports.validateNoURL = exports.validateNoHTML = void 0;
const enum_1 = require("../models/enum");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const limiterConfig_1 = require("../config/limiterConfig");
var sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;
const validator_1 = __importDefault(require("validator"));
function validateNoHTML(text) {
    const clean = (0, sanitize_html_1.default)(text, {
        allowedTags: [],
        allowedAttributes: {}
    });
    return clean;
}
exports.validateNoHTML = validateNoHTML;
function validateNoURL(text) {
    return sanitizeUrl(text);
}
exports.validateNoURL = validateNoURL;
function baseValidation(text) {
    if (text == null)
        return text;
    if (text.length == 0)
        return null;
    text = validateNoHTML(text);
    text = validateNoURL(text);
    return text;
}
exports.baseValidation = baseValidation;
function validateEmail(str) {
    assertNotNullOrEmpty(str);
    str = baseValidation(str);
    if (validator_1.default.isEmail(str))
        return str;
    throw new Error("Invalid email format");
}
exports.validateEmail = validateEmail;
function validateName(str) {
    assertNotNullOrEmpty(str);
    str = baseValidation(str);
    const regex = /^[A-Z][a-zA-Z]{1,34}$/;
    if (regex.test(str)) {
        return str;
    }
    throw new Error("Invalid name format");
}
exports.validateName = validateName;
function validateWord(str) {
    assertNotNullOrEmpty(str);
    str = baseValidation(str);
    if (validator_1.default.isAlpha(str) && validator_1.default.isLength(str, { min: 1, max: 34 })) {
        return str;
    }
    throw new Error("Invalid word format");
}
exports.validateWord = validateWord;
function validateUsername(str) {
    assertNotNullOrEmpty(str);
    str = baseValidation(str);
    if (validator_1.default.isAlphanumeric(str) && validator_1.default.isLength(str, { min: 4, max: 35 })) {
        return str.toLowerCase();
    }
    throw new Error("Invalid username format");
}
exports.validateUsername = validateUsername;
function validateMobileNumber(str) {
    assertNotNullOrEmpty(str);
    str = baseValidation(str);
    const regex = /^09\d{9}$/;
    if (regex.test(str)) {
        return str;
    }
    throw new Error("Invalid mobile number format.");
}
exports.validateMobileNumber = validateMobileNumber;
function validateInteger(str) {
    assertNotNullOrEmpty(str);
    str = baseValidation(str);
    if (validator_1.default.isInt(str)) {
        return parseInt(str.toString());
    }
    throw new Error("Invalid number format.");
}
exports.validateInteger = validateInteger;
function validateLimit(str) {
    const limit = validateInteger(str);
    if (limit <= 0) {
        throw new Error("Invalid Limit Value. Too small");
    }
    if (limit > limiterConfig_1.LIMIT_MAX) {
        throw new Error("Limit value too large");
    }
    return limit;
}
exports.validateLimit = validateLimit;
function validatePassword(str) {
    assertNotNullOrEmpty(str);
    str = baseValidation(str);
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,32}$/;
    if (!regex.test(str)) {
        throw new Error("Invalid password format.");
    }
    return str;
}
exports.validatePassword = validatePassword;
function validateRole(str) {
    assertNotNullOrEmpty(str);
    str = baseValidation(str);
    if (enum_1.ALL_ROLES.includes(str))
        return str;
    throw new Error("Invalid Role");
}
exports.validateRole = validateRole;
function validateLicensePlate(str) {
    assertNotNullOrEmpty(str);
    str = baseValidation(str);
    const regex = /^[A-Z0-9]{6,7}$/; // Follows the specs for Filipino license plates
    if (!regex.test(str)) {
        throw new Error("Invalid License Plate");
    }
    return str;
}
exports.validateLicensePlate = validateLicensePlate;
function assertNotNullOrEmpty(field) {
    if (field == null || field == undefined || field == "") {
        throw new Error("Field is empty");
    }
}
exports.assertNotNullOrEmpty = assertNotNullOrEmpty;
const minSize = 5 * 1024; // 5 KB
const maxSize = 1024 * 1024; // 1 MB
const allowedMimeTypes = ['image/jpeg', 'image/png'];
const MAGIC_NUMBERS = {
    jpg: ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
    png: '89504e470d0a1a0a',
};
function checkMagicNumbers(buffer) {
    const jpgMagic = buffer.toString('hex', 0, 4);
    const pngMagic = buffer.toString('hex', 0, 8);
    return MAGIC_NUMBERS.jpg.includes(jpgMagic) || pngMagic === MAGIC_NUMBERS.png;
}
function validateImage(image) {
    if (image == null || image.size < minSize)
        throw new Error("Invalid Image");
    if (!allowedMimeTypes.includes(image.mimetype) || !checkMagicNumbers(image.buffer)) {
        throw new Error("Invalid File Format");
    }
    if (image.size > maxSize) {
        throw new Error("Image is too large");
    }
    return image;
}
exports.validateImage = validateImage;
