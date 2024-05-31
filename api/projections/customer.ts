export const makeCustomerView = (document) => {
    console.log(document)
    if (document == null)
        return {};
        
    return {
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