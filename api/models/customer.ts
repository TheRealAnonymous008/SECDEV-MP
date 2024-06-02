import { RowDataPacket } from "mysql2";

export default interface Customer extends RowDataPacket {
    id : number, 
    firistName?: string,
    lastName?: string, 
    mobileNumber?: string,
    email?: string,
    companyy?: string, 
    insurance?: string ,
    remarks?: string 
}