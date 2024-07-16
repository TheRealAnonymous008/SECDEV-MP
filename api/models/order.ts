import { RowDataPacket } from "mysql2";

export default interface Order extends RowDataPacket {
    Id : number,
    Status?: string, 
    TimeIn?: string, 
    TimeOut?: string, 
    CustomerId?: string,
    TypeId?: string, 
    VehicleId?: string,
    EstimateNumber? : string, 
    ScopeOfWork?: string, 
    IsVerified?: boolean
}

export interface OrderRow {
    Status?: string, 
    TimeIn?: Date, 
    TimeOut?: Date, 
    CustomerId?: string,
    TypeId?: string, 
    VehicleId?: string,
    EstimateNumber? : string, 
    ScopeOfWork?: string, 
    IsVerified?: boolean
} 