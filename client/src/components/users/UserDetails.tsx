export interface User {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    mobileNumber : string, 
    email : string,
    password : string,
    confirmPassword : string,
    role: string
}

export interface UserRequest {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    email : string,
    mobileNumber : string,
    password : string,
    confirmPassword : string,
    role: string
}