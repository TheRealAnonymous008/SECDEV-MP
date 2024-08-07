export interface Expense {
    Id: number;
    InvoiceAmount: number;
    InvoiceDeductible: number;
    AgentFirstName: string;
    AgentLastName: string;
    DatePaid: string;
    AgentCommission: number;
}

export interface ExpenseRequest {
    InvoiceAmount: number;
    InvoiceDeductible: number;
    AgentFirstName: string;
    AgentLastName: string;
    DatePaid: string;
    AgentCommission: number;
}