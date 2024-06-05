import { RowDataPacket } from "mysql2";

export default interface Vehicle extends RowDataPacket {
    Id: number, 
    LicensePlate: string,
    Model: string, 
    Manufacturer: string,
    YearManufactured: number,
    Color: string,
    Engine: string,
    Remarks: string 
}

export interface VehicleRow {
    LicensePlate?: string,
    Model?: string, 
    Manufacturer?: string,
    YearManufactured?: number,
    Color?: string,
    Engine?: string,
    Remarks?: string 
} 