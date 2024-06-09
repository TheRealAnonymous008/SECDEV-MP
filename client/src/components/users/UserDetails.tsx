export interface User {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    mobileNumber : string, 
    email : string,
    role: string
}

export interface UserRequest {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    role: string
}