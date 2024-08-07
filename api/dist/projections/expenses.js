"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeExpenseArrayView = exports.makeExpenseView = void 0;
const makeExpenseView = (document) => {
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
};
exports.makeExpenseView = makeExpenseView;
const makeExpenseArrayView = (documents) => {
    return documents.map((val) => {
        return (0, exports.makeExpenseView)(val);
    });
};
exports.makeExpenseArrayView = makeExpenseArrayView;
