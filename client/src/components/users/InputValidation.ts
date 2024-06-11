export const emailRegex = /^(?!.*[-_.](?![a-zA-Z0-9]))[a-zA-Z0-9][a-zA-Z0-9._-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
export const nameRegex = /^[A-Z][a-zA-Z]{1,34}$/;
export const wordRegex = /^[a-zA-Z]{1,34}$/;
export const usernameRegex = /^[a-zA-Z0-9]{4,35}$/;
export const mobileNumberRegex = /^09\d{11}$/;
export const integerRegex = /\d+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,32}$/;