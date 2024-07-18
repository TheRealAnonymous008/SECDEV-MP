import { RowDataPacket } from "mysql2";

export default interface Order extends RowDataPacket {
    Id : number,
    Status?: string, 
    TimeIn?: string, 
    TimeOut?: string, 
    CustomerId?: number,
    TypeId?: string, 
    VehicleId?: number,
    EstimateNumber? : string, 
    ScopeOfWork?: string, 
    IsVerified?: boolean
}

export interface OrderRow {
    Status?: string, 
    TimeIn?: string, 
    TimeOut?: string, 
    CustomerId?: number,
    TypeId?: string, 
    VehicleId?: number,
    EstimateNumber? : string, 
    ScopeOfWork?: string, 
    IsVerified?: boolean
} 