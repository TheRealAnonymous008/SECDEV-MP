import { Customer } from "../customers/CustomerDetails"
import { Expense } from "../expenses/ExpenseDetails"
import { Invoice, InvoiceRequest } from "./InvoiceDetails"
import { Vehicle } from "../vehicles/VehicleDetails"

export interface OrderRequest {
    status: string,
    timeIn: Date,
    timeOut: Date,
    customer : string,
    type: string,
    vehicle: string,
    estimateNumber: string,
    scopeOfWork: string,
    invoice: InvoiceRequest,
    expenses: Array<Expense>
}

export interface OrderRequestDefault {
    status: string,
    timeIn: Date,
    timeOut: Date,
    customer : {
        id: number,
        name: string
    },
    type: string,
    vehicle: {
        id: number, 
        licensePlate: string,
    },
    estimateNumber: string,
    scopeOfWork: string,
    invoice: InvoiceRequest
    expenses: Array<Expense>
}

export interface Order {
    id: string,
    isVerified: boolean,
    status: string, 
    timeIn: string,
    timeOut: string,
    
    customer: Customer,
    type: string,
    company: string,
    vehicle: Vehicle,

    estimateNumber: string,
    scopeOfWork: string,
    expenses: Array<Expense>,
    invoice: Invoice
}

