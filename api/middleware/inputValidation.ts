export function validateEmail(email) {
    const emailRegex = /^(?!.*[-_.](?![a-zA-Z0-9]))[a-zA-Z0-9][a-zA-Z0-9._-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }
}

export function validateMobileNumber(mobileNumber) {
    const mobileNumberRegex = /^09\d{9}$/;

    if (!mobileNumberRegex.test(mobileNumber)) {
        throw new Error("Invalid mobile number format.");
    }
}


export function validateRequiredFields(firstName, lastName, username, password, mobileNumber, email) {
    console.log('Validating required fields');
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

export function validateRegistrationInput(firstName, lastName, username, password, mobileNumber, email) {
    try {
        validateRequiredFields(firstName, lastName, username, password, mobileNumber, email);
        validateMobileNumber(mobileNumber);
        validateEmail(email);
        
        console.log('All validations passed');
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}
