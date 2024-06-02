import { RowDataPacket } from "mysql2";

export default interface User extends RowDataPacket {
    Id : number, 
    FirstName?: string,
    LastName?: string, 
    Username? : string, 
    Password? : string,
    Salt? : string,
    MobileNumber?: string,
    Email?: string,
    Role?: number
}

export interface UserRow {
    FirstName?: string,
    LastName?: string, 
    Username? : string, 
    Password? : string,
    Salt? : string,
    MobileNumber?: string,
    Email?: string,
    Role?: number
} 