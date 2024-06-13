import { assert } from "console";
import { ALL_ROLES, Roles } from "../models/enum";

import sanitizeHtml from 'sanitize-html';


export function validateNoHTML(text) {
    const clean = sanitizeHtml(text, {
        allowedTags: [],
        allowedAttributes: {}
      });
    return clean
}

export function baseValidation(text) {
    text = validateNoHTML(text)
    return text 
}

export function validateEmail(email) {
    assertNotNullOrEmpty(email)
    email = validateNoHTML(email)

    const regex = /^(?!.*[-_.](?![a-zA-Z0-9]))[a-zA-Z0-9][a-zA-Z0-9._-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
        throw new Error("Invalid email format");
    }
    return email
}


export function validateName(name) {
    assertNotNullOrEmpty(name)
    name = validateNoHTML(name)
    const regex = /^[A-Z][a-zA-Z]{1,34}$/;

    if (!regex.test(name)) {
        throw new Error("Invalid name format");
    }
    return name
}

export function validateWord(name) {
    assertNotNullOrEmpty(name)
    name = validateNoHTML(name)
    const regex = /^[a-zA-Z]{1,34}$/;

    if (!regex.test(name)) {
        throw new Error("Invalid word format");
    }
    return name
}

export function validateUsername(username) {
    assertNotNullOrEmpty(username)
    username = validateNoHTML(username)
    const regex = /^[a-zA-Z0-9]{4,35}$/;

    if (!regex.test(username)) {
        throw new Error("Invalid username format");
    }
    return username
}

export function validateMobileNumber(mobileNumber) {
    assertNotNullOrEmpty(mobileNumber)
    mobileNumber = validateNoHTML(mobileNumber)
    const regex = /^09\d{9}$/;

    if (!regex.test(mobileNumber)) {
        throw new Error("Invalid mobile number format.");
    }
    return mobileNumber
}

export function validateInteger(number : string) {
    assertNotNullOrEmpty(number)
    number = validateNoHTML(number)

    const regex = /\d+$/;

    if (!regex.test(number)) {
        throw new Error("Invalid number format.");
    }
    return parseInt(number.toString()); 
}


export function validatePassword(password) {
    assertNotNullOrEmpty(password)
    password = validateNoHTML(password)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,32}$/;

    if (!regex.test(password)) {
        throw new Error("Invalid password format.");
    }
    return password
}

export function validateRole(role) {
    assertNotNullOrEmpty(role)
    role = validateNoHTML(role)

    if (ALL_ROLES.includes(role))
        return role 

    throw new Error("Invalid Role")
}

export function validateLicensePlate(licensePlate){
    assertNotNullOrEmpty(licensePlate)
    licensePlate = validateNoHTML(licensePlate)

    const regex = /^[A-Z0-9]{6,7}$/;                // Follows the specs for Filipino license plates

    if (!regex.test(licensePlate)){
        throw new Error("Invalid License Plate")
    }

    return licensePlate;
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

