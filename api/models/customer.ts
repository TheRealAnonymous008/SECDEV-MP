import { RowDataPacket } from "mysql2";

export default interface Customer extends RowDataPacket {
    id : number, 
    firstName?: string,
    lastName?: string, 
    mobileNumber?: string,
    email?: string,
    company?: string, 
    insurance?: string ,
    remarks?: string 
}

export interface CustomerRow {
    firstName?: string,
    lastName?: string, 
    mobileNumber?: string,
    email?: string,
    company?: string, 
    insurance?: string ,
    remarks?: string 
} 