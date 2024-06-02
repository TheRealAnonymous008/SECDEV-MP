import { RowDataPacket } from "mysql2";

export default interface User extends RowDataPacket {
    id : number, 
    firstName?: string,
    lastName?: string, 
    username? : string, 
    password? : string,
    salt? : string,
    mobileNumber?: string,
    email?: string,
    role?: number
}

export interface UserRow {
    firstName?: string,
    lastName?: string, 
    username? : string, 
    password? : string,
    salt? : string,
    mobileNumber?: string,
    email?: string,
    role?: number
} 