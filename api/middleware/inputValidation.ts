import { assert } from "console";
import { ALL_ROLES, Roles } from "../models/enum";

export function validateEmail(email) {
    assertNotNullOrEmpty(email)
    const regex = /^(?!.*[-_.](?![a-zA-Z0-9]))[a-zA-Z0-9][a-zA-Z0-9._-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
        throw new Error("Invalid email format");
    }
    return email
}


export function validateName(name) {
    assertNotNullOrEmpty(name)
    const regex = /^[A-Z][a-zA-Z]{1,34}$/;

    if (!regex.test(name)) {
        throw new Error("Invalid name format");
    }
    return name
}

export function validateWord(name) {
    assertNotNullOrEmpty(name)
    const regex = /^[a-zA-Z]{1,34}$/;

    if (!regex.test(name)) {
        throw new Error("Invalid word format");
    }
    return name
}

export function validateUsername(username) {
    assertNotNullOrEmpty(username)
    const regex = /^[a-zA-Z0-9]{4,35}$/;

    if (!regex.test(username)) {
        throw new Error("Invalid username format");
    }
    return username
}

export function validateMobileNumber(mobileNumber) {
    assertNotNullOrEmpty(mobileNumber)
    const regex = /^09\d{9}$/;

    if (!regex.test(mobileNumber)) {
        throw new Error("Invalid mobile number format.");
    }
    return mobileNumber
}

export function validateInteger(number : string) {
    assertNotNullOrEmpty(number)

    const regex = /\d+$/;

    if (!regex.test(number)) {
        throw new Error("Invalid number format.");
    }
    return parseInt(number.toString()); 
}


export function validatePassword(password) {
    assertNotNullOrEmpty(password)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,32}$/;

    if (!regex.test(password)) {
        throw new Error("Invalid password format.");
    }
    return password
}

export function validateRole(role) {
    assertNotNullOrEmpty(role)

    if (ALL_ROLES.includes(role))
        return role 

    throw new Error("Invalid Role")
}

export function validateLicensePlate(liciensePlate){
    assertNotNullOrEmpty(liciensePlate)

    const regex = /^[A-Z0-9]{6,7}$/;                // Follows the specs for Filipino license plates

    if (!regex.test(liciensePlate)){
        throw new Error("Invalid License Plate")
    }

    return liciensePlate;
}

export function assertNotNullOrEmpty(field) {
    if (field == null || field == undefined || field == "" ){
        throw new Error("Field is empty")
    }
}


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

export function validateImage(image : Express.Multer.File){
    if (image == null)
        throw new Error("Invalid Image")

    if (!allowedMimeTypes.includes(image.mimetype) || !checkMagicNumbers(image.buffer)) {
        throw new Error("Invalid File FOrmat");
    }

    if (image.size > maxSize) {
        throw new Error("Image is too large")
    }

    return image   
}
