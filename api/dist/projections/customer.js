"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCustomerArrayView = exports.makeCustomerView = void 0;
const makeCustomerView = (document) => {
    console.log(document);
    if (document == null)
        return {};
    return {
        id: document.Id,
        name: {
            firstName: document.FirstName,
            lastName: document.LastName,
            val: document.FirstName + " " + document.LastName,
        },
        mobileNumber: document.MobileNumber,
        email: document.Email,
        company: document.Company,
        insurance: document.Insurance,
        remarks: document.Remarks
    };
};
exports.makeCustomerView = makeCustomerView;
const makeCustomerArrayView = (documents) => {
    return documents.map((val) => {
        return (0, exports.makeCustomerView)(val);
    });
};
exports.makeCustomerArrayView = makeCustomerArrayView;
