import { assert } from "console";
import { ALL_ROLES, Roles } from "../models/enum";

import sanitizeHtml from 'sanitize-html';
import { LIMIT_MAX } from "../config/limiterConfig";
var sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;

import validator from "validator";

export function validateNoHTML(text) {
    const clean = sanitizeHtml(text, {
        allowedTags: [],
        allowedAttributes: {}
      });
    return clean
}

export function validateNoURL(text) {
    return sanitizeUrl(text)
}

export function baseValidation(text) {
    if (text == null)
        return text;

    if (text.length == 0)
        return null
    
    text = validateNoHTML(text)
    text = validateNoURL(text)
    return text 
}

export function validateEmail(str) {
    assertNotNullOrEmpty(str)
    str = baseValidation(str)

    if (validator.isEmail(str)) 
        return str 
    
    throw new Error("Invalid email format");
}


export function validateName(str) {
    assertNotNullOrEmpty(str)
    str = baseValidation(str)

    const regex = /^[A-Z][a-zA-Z]{1,34}$/;

    if (regex.test(str)) {
        return str
    }
    throw new Error("Invalid name format");
}

export function validateWord(str) {
    assertNotNullOrEmpty(str)
    str = baseValidation(str)

    if (validator.isAlpha(str) && validator.isLength(str, {min: 1, max:34})) {
        return str
    }
    throw new Error("Invalid word format");
}

export function validateUsername(str : string) {
    assertNotNullOrEmpty(str)
    str = baseValidation(str)

    if (validator.isAlphanumeric(str) && validator.isLength(str, {min: 4, max: 35})) {
        return str.toLowerCase()
    }
    throw new Error("Invalid username format");
}

export function validateMobileNumber(str) {
    assertNotNullOrEmpty(str)
    str = baseValidation(str)
    const regex = /^09\d{9}$/;

    if (regex.test(str)) {
        return str
    }
    throw new Error("Invalid mobile number format.");
}

export function validateInteger(str : string) {
    assertNotNullOrEmpty(str)
    str = baseValidation(str)

    if (validator.isInt(str)) {
        return parseInt(str.toString()); 
    }
    throw new Error("Invalid number format.");
}

export function validateLimit(str) {
    const limit = validateInteger(str)
    if (limit <= 0){
        throw new Error("Invalid Limit Value. Too small")
    }
    if (limit > LIMIT_MAX){
        throw new Error("Limit value too large")
    }
    return limit;
}


export function validatePassword(str) {
    assertNotNullOrEmpty(str)
    str = baseValidation(str)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,32}$/;

    if (!regex.test(str)) {
        throw new Error("Invalid password format.");
    }
    return str
}

export function validateRole(str) {
    assertNotNullOrEmpty(str)
    str = baseValidation(str)

    if (ALL_ROLES.includes(str))
        return str 

    throw new Error("Invalid Role")
}

export function validateLicensePlate(str){
    assertNotNullOrEmpty(str)
    str = baseValidation(str)

    const regex = /^[A-Z0-9]{6,7}$/;                // Follows the specs for Filipino license plates

    if (!regex.test(str)){
        throw new Error("Invalid License Plate")
    }

    return str;
}

export function assertNotNullOrEmpty(field) {
    if (field == null || field == undefined || field == "" ){
        throw new Error("Field is empty")
    }
}

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

export function validateImage(image) {
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

