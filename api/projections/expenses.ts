export const makeExpenseView = (document) => {
    if (document == null)
        return {};
        
    return {
        Id: document.Id,
        InvoiceAmount: document.InvoiceAmount,
        InvoiceDeductible: document.InvoiceDeductible,
        AgentFirstName: document.AgentFirstName,
        AgentLastName: document.AgentLastName,
        DatePaid: document.DatePaid,
        AgentCommission: document.AgentCommission
    };
}

export const makeExpenseArrayView = (documents) => {
    return documents.map((val) => {
        return makeExpenseView(val)
    });
}