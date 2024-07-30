export const makeCustomerView = (document) => {
    if (document == null)
        return {};
        
    return {
        id: document.Id,
        name: {
            firstName: document.FirstName,
            lastName: document.LastName,
            val: document.FirstName + " " +  document.LastName,
        },
        mobileNumber: document.MobileNumber,
        email: document.Email,
        company: document.Company,
        insurance: document.Insurance,
        remarks: document.Remarks
    };
}

export const makeCustomerArrayView = (documents) => {
    return documents.map((val) => {
        return makeCustomerView(val)
    });
}