import { ALL_ROLES, RoleIds, Roles } from "../models/enum";

import sanitizeHtml from 'sanitize-html';
import { LIMIT_MAX } from "../config/limiterConfig";
var sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;

import validator from "validator";
import sharp from "sharp";

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

export function validateOptional(str, validator){
    if (str == null || str == ""|| str == undefined) {
        return null
    }
    return validator(str)
}

export function validateRequired(str, validator) {
    assertNotNullOrEmpty(str)
    return validator(str)
}

export function validateEmail(str) {
    str = baseValidation(str)

    if (validator.isEmail(str)) 
        return str 
    
    throw new Error("Invalid email format");
}


export function validateName(str) {
    str = baseValidation(str)

    const regex = /^[A-Z][a-zA-Z]{1,34}$/;

    if (regex.test(str)) {
        return str
    }
    throw new Error("Invalid name format");
}

export function validateWord(str) {
    str = baseValidation(str)

    if (validator.isAlpha(str) && validator.isLength(str, {min: 1, max:34})) {
        return str
    }
    throw new Error("Invalid word format");
}

export function validateAlphaNumeric(str) {
    str = baseValidation(str)

    if (validator.isAlphanumeric(str))
        return str 

    throw new Error("Invalid Alpha Format")
}

export function validateUsername(str : string) {
    str = baseValidation(str)

    if (validator.isAlphanumeric(str) && validator.isLength(str, {min: 4, max: 35})) {
        return str.toLowerCase()
    }
    throw new Error("Invalid username format");
}

export function validateMobileNumber(str) {
    str = baseValidation(str)
    const regex = /^09\d{9}$/;

    if (regex.test(str)) {
        return str
    }
    throw new Error("Invalid mobile number format.");
}

export function validateInteger(str : string) {
    str = baseValidation(str)

    if (validator.isInt(str)) {
        return parseInt(str.toString()); 
    }
    throw new Error("Invalid number format.");
}

export function validateFloat(str : string) {
    str = baseValidation(str)

    if (validator.isFloat(str) && parseFloat(str) >= 0) {
        return parseFloat(str.toString()); 
    }

    throw new Error("Invalid number format.");
}

export function validateNonNegative(str : string) {
    const x = validateInteger(str)
    if (x >= 0){
        return x
    }
    throw new Error("Expected Non-negative Integer")
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
    str = baseValidation(str)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,32}$/;

    if (!regex.test(str)) {
        throw new Error("Invalid password format.");
    }
    return str
}

export function validateRole(role) {
    role = baseValidation(role);

    const roleKey = role.toUpperCase();
    if (! ALL_ROLES.includes(roleKey)) {
        throw new Error("Invalid Role");
    }
    return ALL_ROLES.indexOf(roleKey) + 1;

}

export function validateLicensePlate(str){
    str = baseValidation(str)

    const regex = /^[A-Z0-9]{6,7}$/;                // Follows the specs for Filipino license plates

    if (!regex.test(str)){
        throw new Error("Invalid License Plate")
    }

    return str;
}

export function validateDate(str) {
    str = baseValidation(str);
    const date = new Date(str);
    const status = !isNaN(date.getTime()) && date instanceof Date;
    let formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

    if (!status) {
        throw new Error("Invalid Date Time Format")
    }

    return formattedDate
}

export function validateJWT(str) {
    str = baseValidation(str);

    if (! validator.isJWT(str)){
        throw new Error("Not JWT")
    }
    return str;
}

export function assertNotNullOrEmpty(field) {
    if (field == null || field == undefined || field == "" ){
        throw new Error("Field is empty")
    }
}


// Image validation goes here

const minSize = 5 * 1024; // 5 KB
const maxSizeImage = 1024 * 1024; // 1 MB
const maxSizePdf = 5 * 1024 * 1024 // 5 MB

const allowedMimeTypes = {
    img: ['image/jpeg', 'image/png'],
    pdf: ['application/pdf']
};

const MAGIC_NUMBERS = {
    jpg: ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
    png: '89504e470d0a1a0a',
    pdf: ['255044462d']
};

function checkMagicNumbersImage(buffer) {
    const jpgMagic = buffer.toString('hex', 0, 4);
    const pngMagic = buffer.toString('hex', 0, 8);
    return MAGIC_NUMBERS.jpg.includes(jpgMagic) || pngMagic === MAGIC_NUMBERS.png;
}

function checkMagicNumbersPdf(buffer){
    const pdfMagic = buffer.toString('hex', 0, 5);
    return MAGIC_NUMBERS.pdf.includes(pdfMagic)
}

export async function validateImage(image) {
    if (image == null || image.size < minSize)
        throw new Error("Invalid Image");

    if (!allowedMimeTypes.img.includes(image.mimetype) || !checkMagicNumbersImage(image.buffer)) {
        throw new Error("Invalid File Format");
    }

    if (image.size > maxSizeImage) {
        throw new Error("Image is too large");
    }

    return await sanitizeImage(image);   
}

export function validatePdf(pdf) {
    if (pdf == null || pdf.size < minSize) {
        throw new Error("Invalid PDF");
    }

    if (!allowedMimeTypes.pdf.includes(pdf.mimetype) || !checkMagicNumbersPdf(pdf.buffer)) {
        throw new Error("Invalid File Format");
    }

    if (pdf.size > maxSizePdf) {
        throw new Error("PDF is too large");
    }

    return pdf;
}

export async function sanitizeImage(image : Express.Multer.File) {
    let imageProcessor = sharp(image.buffer)
    image.buffer = await imageProcessor.toBuffer();
    return image
}

