"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImage = exports.assertNotNullOrEmpty = exports.validateLicensePlate = exports.validateRole = exports.validatePassword = exports.validateInteger = exports.validateMobileNumber = exports.validateUsername = exports.validateWord = exports.validateName = exports.validateEmail = void 0;
const enum_1 = require("../models/enum");
function validateEmail(email) {
    assertNotNullOrEmpty(email);
    const regex = /^(?!.*[-_.](?![a-zA-Z0-9]))[a-zA-Z0-9][a-zA-Z0-9._-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
        throw new Error("Invalid email format");
    }
    return email;
}
exports.validateEmail = validateEmail;
function validateName(name) {
    assertNotNullOrEmpty(name);
    const regex = /^[A-Z][a-zA-Z]{1,34}$/;
    if (!regex.test(name)) {
        throw new Error("Invalid name format");
    }
    return name;
}
exports.validateName = validateName;
function validateWord(name) {
    assertNotNullOrEmpty(name);
    const regex = /^[a-zA-Z]{1,34}$/;
    if (!regex.test(name)) {
        throw new Error("Invalid word format");
    }
    return name;
}
exports.validateWord = validateWord;
function validateUsername(username) {
    assertNotNullOrEmpty(username);
    const regex = /^[a-zA-Z0-9]{4,35}$/;
    if (!regex.test(username)) {
        throw new Error("Invalid username format");
    }
    return username;
}
exports.validateUsername = validateUsername;
function validateMobileNumber(mobileNumber) {
    assertNotNullOrEmpty(mobileNumber);
    const regex = /^09\d{9}$/;
    if (!regex.test(mobileNumber)) {
        throw new Error("Invalid mobile number format.");
    }
    return mobileNumber;
}
exports.validateMobileNumber = validateMobileNumber;
function validateInteger(number) {
    assertNotNullOrEmpty(number);
    const regex = /\d+$/;
    if (!regex.test(number)) {
        throw new Error("Invalid number format.");
    }
    return parseInt(number.toString());
}
exports.validateInteger = validateInteger;
function validatePassword(password) {
    assertNotNullOrEmpty(password);
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,32}$/;
    if (!regex.test(password)) {
        throw new Error("Invalid password format.");
    }
    return password;
}
exports.validatePassword = validatePassword;
function validateRole(role) {
    assertNotNullOrEmpty(role);
    if (enum_1.ALL_ROLES.includes(role))
        return role;
    throw new Error("Invalid Role");
}
exports.validateRole = validateRole;
function validateLicensePlate(liciensePlate) {
    assertNotNullOrEmpty(liciensePlate);
    const regex = /^[A-Z0-9]{6,7}$/; // Follows the specs for Filipino license plates
    if (!regex.test(liciensePlate)) {
        throw new Error("Invalid License Plate");
    }
    return liciensePlate;
}
exports.validateLicensePlate = validateLicensePlate;
function assertNotNullOrEmpty(field) {
    if (field == null || field == undefined || field == "") {
        throw new Error("Field is empty");
    }
}
exports.assertNotNullOrEmpty = assertNotNullOrEmpty;
const maxSize = 1024 * 1024;
const allowedMimeTypes = ['image/jpeg', 'image/png'];
const MAGIC_NUMBERS = {
    jpg: 'ffd8ffe0',
    png: '89504e47',
};
function checkMagicNumbers(buffer) {
    const magic = buffer.toString('hex', 0, 4);
    return MAGIC_NUMBERS.jpg === magic || MAGIC_NUMBERS.png === magic;
}
function validateImage(image) {
    if (image == null)
        throw new Error("Invalid Image");
    if (!allowedMimeTypes.includes(image.mimetype) || !checkMagicNumbers(image.buffer)) {
        throw new Error("Invalid File FOrmat");
    }
    if (image.size > maxSize) {
        throw new Error("Image is too large");
    }
    return image;
}
exports.validateImage = validateImage;
