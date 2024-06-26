"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImage = exports.assertNotNullOrEmpty = exports.validateLicensePlate = exports.validateRole = exports.validatePassword = exports.validateInteger = exports.validateMobileNumber = exports.validateUsername = exports.validateWord = exports.validateName = exports.validateEmail = exports.baseValidation = exports.validateNoURL = exports.validateNoHTML = void 0;
const enum_1 = require("../models/enum");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
var sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;
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
function validateEmail(email) {
    assertNotNullOrEmpty(email);
    email = baseValidation(email);
    const regex = /^(?!.*[-_.](?![a-zA-Z0-9]))[a-zA-Z0-9][a-zA-Z0-9._-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
        throw new Error("Invalid email format");
    }
    return email;
}
exports.validateEmail = validateEmail;
function validateName(name) {
    assertNotNullOrEmpty(name);
    name = baseValidation(name);
    const regex = /^[A-Z][a-zA-Z]{1,34}$/;
    if (!regex.test(name)) {
        throw new Error("Invalid name format");
    }
    return name;
}
exports.validateName = validateName;
function validateWord(name) {
    assertNotNullOrEmpty(name);
    name = baseValidation(name);
    const regex = /^[a-zA-Z]{1,34}$/;
    if (!regex.test(name)) {
        throw new Error("Invalid word format");
    }
    return name;
}
exports.validateWord = validateWord;
function validateUsername(username) {
    assertNotNullOrEmpty(username);
    username = baseValidation(username);
    const regex = /^[a-zA-Z0-9]{4,35}$/;
    if (!regex.test(username)) {
        throw new Error("Invalid username format");
    }
    return username;
}
exports.validateUsername = validateUsername;
function validateMobileNumber(mobileNumber) {
    assertNotNullOrEmpty(mobileNumber);
    mobileNumber = baseValidation(mobileNumber);
    const regex = /^09\d{9}$/;
    if (!regex.test(mobileNumber)) {
        throw new Error("Invalid mobile number format.");
    }
    return mobileNumber;
}
exports.validateMobileNumber = validateMobileNumber;
function validateInteger(number) {
    assertNotNullOrEmpty(number);
    number = baseValidation(number);
    const regex = /\d+$/;
    if (!regex.test(number)) {
        throw new Error("Invalid number format.");
    }
    return parseInt(number.toString());
}
exports.validateInteger = validateInteger;
function validatePassword(password) {
    assertNotNullOrEmpty(password);
    password = baseValidation(password);
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,32}$/;
    if (!regex.test(password)) {
        throw new Error("Invalid password format.");
    }
    return password;
}
exports.validatePassword = validatePassword;
function validateRole(role) {
    assertNotNullOrEmpty(role);
    role = baseValidation(role);
    if (enum_1.ALL_ROLES.includes(role))
        return role;
    throw new Error("Invalid Role");
}
exports.validateRole = validateRole;
function validateLicensePlate(licensePlate) {
    assertNotNullOrEmpty(licensePlate);
    licensePlate = baseValidation(licensePlate);
    const regex = /^[A-Z0-9]{6,7}$/; // Follows the specs for Filipino license plates
    if (!regex.test(licensePlate)) {
        throw new Error("Invalid License Plate");
    }
    return licensePlate;
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
