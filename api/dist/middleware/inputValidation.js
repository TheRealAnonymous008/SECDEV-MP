"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeImage = exports.validatePdf = exports.validateImage = exports.assertNotNullOrEmpty = exports.validateJWT = exports.validateDate = exports.validateLicensePlate = exports.validateRole = exports.validatePassword = exports.validateLimit = exports.validateNonNegative = exports.validateInteger = exports.validateMobileNumber = exports.validateUsername = exports.validateAlphaNumeric = exports.validateWord = exports.validateName = exports.validateEmail = exports.validateRequired = exports.validateOptional = exports.baseValidation = exports.validateNoURL = exports.validateNoHTML = void 0;
const enum_1 = require("../models/enum");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const limiterConfig_1 = require("../config/limiterConfig");
var sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;
const validator_1 = __importDefault(require("validator"));
const sharp_1 = __importDefault(require("sharp"));
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
function validateOptional(str, validator) {
    if (str == null || str == "" || str == undefined) {
        return null;
    }
    return validator(str);
}
exports.validateOptional = validateOptional;
function validateRequired(str, validator) {
    assertNotNullOrEmpty(str);
    return validator(str);
}
exports.validateRequired = validateRequired;
function validateEmail(str) {
    str = baseValidation(str);
    if (validator_1.default.isEmail(str))
        return str;
    throw new Error("Invalid email format");
}
exports.validateEmail = validateEmail;
function validateName(str) {
    str = baseValidation(str);
    const regex = /^[A-Z][a-zA-Z]{1,34}$/;
    if (regex.test(str)) {
        return str;
    }
    throw new Error("Invalid name format");
}
exports.validateName = validateName;
function validateWord(str) {
    str = baseValidation(str);
    if (validator_1.default.isAlpha(str) && validator_1.default.isLength(str, { min: 1, max: 34 })) {
        return str;
    }
    throw new Error("Invalid word format");
}
exports.validateWord = validateWord;
function validateAlphaNumeric(str) {
    str = baseValidation(str);
    if (validator_1.default.isAlphanumeric(str))
        return str;
    throw new Error("Invalid Alpha Format");
}
exports.validateAlphaNumeric = validateAlphaNumeric;
function validateUsername(str) {
    str = baseValidation(str);
    if (validator_1.default.isAlphanumeric(str) && validator_1.default.isLength(str, { min: 4, max: 35 })) {
        return str.toLowerCase();
    }
    throw new Error("Invalid username format");
}
exports.validateUsername = validateUsername;
function validateMobileNumber(str) {
    str = baseValidation(str);
    const regex = /^09\d{9}$/;
    if (regex.test(str)) {
        return str;
    }
    throw new Error("Invalid mobile number format.");
}
exports.validateMobileNumber = validateMobileNumber;
function validateInteger(str) {
    str = baseValidation(str);
    if (validator_1.default.isInt(str)) {
        return parseInt(str.toString());
    }
    throw new Error("Invalid number format.");
}
exports.validateInteger = validateInteger;
function validateNonNegative(str) {
    const x = validateInteger(str);
    if (x >= 0) {
        return x;
    }
    throw new Error("Expected Non-negative Integer");
}
exports.validateNonNegative = validateNonNegative;
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
    str = baseValidation(str);
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,32}$/;
    if (!regex.test(str)) {
        throw new Error("Invalid password format.");
    }
    return str;
}
exports.validatePassword = validatePassword;
function validateRole(role) {
    role = baseValidation(role);
    const roleKey = role.toUpperCase();
    if (!enum_1.ALL_ROLES.includes(roleKey)) {
        throw new Error("Invalid Role");
    }
    return enum_1.ALL_ROLES.indexOf(roleKey) + 1;
}
exports.validateRole = validateRole;
function validateLicensePlate(str) {
    str = baseValidation(str);
    const regex = /^[A-Z0-9]{6,7}$/; // Follows the specs for Filipino license plates
    if (!regex.test(str)) {
        throw new Error("Invalid License Plate");
    }
    return str;
}
exports.validateLicensePlate = validateLicensePlate;
function validateDate(str) {
    str = baseValidation(str);
    const date = new Date(str);
    const status = !isNaN(date.getTime()) && date instanceof Date;
    let formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    if (!status) {
        throw new Error("Invalid Date Time Format");
    }
    return formattedDate;
}
exports.validateDate = validateDate;
function validateJWT(str) {
    str = baseValidation(str);
    if (!validator_1.default.isJWT(str)) {
        throw new Error("Not JWT");
    }
    return str;
}
exports.validateJWT = validateJWT;
function assertNotNullOrEmpty(field) {
    if (field == null || field == undefined || field == "") {
        throw new Error("Field is empty");
    }
}
exports.assertNotNullOrEmpty = assertNotNullOrEmpty;
// Image validation goes here
const minSize = 5 * 1024; // 5 KB
const maxSizeImage = 1024 * 1024; // 1 MB
const maxSizePdf = 5 * 1024 * 1024; // 5 MB
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
function checkMagicNumbersPdf(buffer) {
    const pdfMagic = buffer.toString('hex', 0, 5);
    return MAGIC_NUMBERS.pdf.includes(pdfMagic);
}
function validateImage(image) {
    return __awaiter(this, void 0, void 0, function* () {
        if (image == null || image.size < minSize)
            throw new Error("Invalid Image");
        if (!allowedMimeTypes.img.includes(image.mimetype) || !checkMagicNumbersImage(image.buffer)) {
            throw new Error("Invalid File Format");
        }
        if (image.size > maxSizeImage) {
            throw new Error("Image is too large");
        }
        return yield sanitizeImage(image);
    });
}
exports.validateImage = validateImage;
function validatePdf(pdf) {
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
exports.validatePdf = validatePdf;
function sanitizeImage(image) {
    return __awaiter(this, void 0, void 0, function* () {
        let imageProcessor = (0, sharp_1.default)(image.buffer);
        image.buffer = yield imageProcessor.toBuffer();
        return image;
    });
}
exports.sanitizeImage = sanitizeImage;
