import { RowDataPacket } from "mysql2";

export default interface Customer extends RowDataPacket {
    Id : number, 
    FirstName?: string,
    LastName?: string, 
    MobileNumber?: string,
    Email?: string,
    Company?: string, 
    Insurance?: string ,
    Remarks?: string 
}

export interface CustomerRow {
    FirstName?: string,
    LastName?: string, 
    MobileNumber?: string,
    Email?: string,
    Company?: string, 
    Insurance?: string ,
    Remarks?: string 
} 