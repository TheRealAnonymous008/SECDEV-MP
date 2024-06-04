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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistrationInput = exports.validateRequiredFields = exports.validateEmail = void 0;
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }
}
exports.validateEmail = validateEmail;
function validateRequiredFields(firstName, lastName, username, password, mobileNumber, email) {
    if (!firstName && !lastName && !username && !password && !mobileNumber && !email) {
        throw new Error("Missing required fields");
    }
}
exports.validateRequiredFields = validateRequiredFields;
function validateRegistrationInput(firstName, lastName, username, password, mobileNumber, email) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.resolve(validateRequiredFields(firstName, lastName, username, password, mobileNumber, email));
        yield Promise.resolve(validateEmail(email));
    });
}
exports.validateRegistrationInput = validateRegistrationInput;
