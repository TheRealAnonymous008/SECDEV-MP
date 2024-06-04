export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }
}

export function validateRequiredFields(firstName, lastName, username, password, mobileNumber, email) {
    if (!firstName && !lastName && !username && !password && !mobileNumber && !email) {
        throw new Error("Missing required fields");
    }
}

export async function validateRegistrationInput(firstName, lastName, username, password, mobileNumber, email) {
    await Promise.resolve(validateRequiredFields(firstName, lastName, username, password, mobileNumber, email));
    await Promise.resolve(validateEmail(email));
}
