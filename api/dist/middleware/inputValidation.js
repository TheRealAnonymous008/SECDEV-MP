"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistrationInput = exports.validateRequiredFields = exports.validatePassword = exports.validateMobileNumber = exports.validateUsername = exports.validateLastName = exports.validateFirstName = exports.validateEmail = void 0;
function validateEmail(email) {
    const emailRegex = /^(?!.*[-_.](?![a-zA-Z0-9]))[a-zA-Z0-9][a-zA-Z0-9._-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }
}
exports.validateEmail = validateEmail;
function validateFirstName(firstName) {
    const firstNameRegex = /^[A-Z][a-zA-Z]{1,34}$/;
    if (!firstNameRegex.test(firstName)) {
        throw new Error("Invalid first name format");
    }
}
exports.validateFirstName = validateFirstName;
function validateLastName(lastName) {
    const lastNameRegex = /^[A-Z][a-zA-Z]{1,34}$/;
    if (!lastNameRegex.test(lastName)) {
        throw new Error("Invalid last name format");
    }
}
exports.validateLastName = validateLastName;
function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9]{4,35}$/;
    if (!usernameRegex.test(username)) {
        throw new Error("Invalid username format");
    }
}
exports.validateUsername = validateUsername;
function validateMobileNumber(mobileNumber) {
    const mobileNumberRegex = /^09\d{9}$/;
    if (!mobileNumberRegex.test(mobileNumber)) {
        throw new Error("Invalid mobile number format.");
    }
}
exports.validateMobileNumber = validateMobileNumber;
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,32}$/;
    if (!passwordRegex.test(password)) {
        throw new Error("Invalid password format.");
    }
}
exports.validatePassword = validatePassword;
function validateRequiredFields(firstName, lastName, username, password, mobileNumber, email) {
    //console.log('Validating required fields');
    if (firstName == null || firstName == undefined || firstName == "") {
        throw new Error("First name is required");
    }
    if (lastName == null || lastName == undefined || lastName == "") {
        throw new Error("Last name is required");
    }
    if (username == null || username == undefined || username == "") {
        throw new Error("Username is required");
    }
    if (password == null || password == undefined || password == "") {
        throw new Error("Password is required");
    }
    if (mobileNumber == null || mobileNumber == undefined || mobileNumber == "") {
        throw new Error("Mobile number is required");
    }
    if (email == null || email == undefined || email == "") {
        throw new Error("Email is required");
    }
}
exports.validateRequiredFields = validateRequiredFields;
function validateRegistrationInput(firstName, lastName, username, password, mobileNumber, email) {
    try {
        validateRequiredFields(firstName, lastName, username, password, mobileNumber, email);
        validateFirstName(firstName);
        validateLastName(lastName);
        validateUsername(username);
        validatePassword(password);
        validateMobileNumber(mobileNumber);
        validateEmail(email);
        console.log('All validations passed');
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
}
exports.validateRegistrationInput = validateRegistrationInput;
