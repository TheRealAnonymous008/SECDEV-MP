import { RowDataPacket } from "mysql2";

export default interface Expense extends RowDataPacket {
    Id: number;
    InvoiceAmount: number;
    InvoiceDeductible: number;
    AgentFirstName: string;
    AgentLastName: string;
    DatePaid: string;
    AgentCommission: number;
}

export interface ExpenseRow {
    InvoiceAmount?: number;
    InvoiceDeductible?: number;
    AgentFirstName?: string;
    AgentLastName?: string;
    DatePaid?: string;
    AgentCommission?: number;
}