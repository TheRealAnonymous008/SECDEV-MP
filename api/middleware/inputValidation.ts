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

export function assertNotNullOrEmpty(field) {
    if (field == null || field == undefined || field == "" ){
        throw new Error("Field is empty")
    }
}