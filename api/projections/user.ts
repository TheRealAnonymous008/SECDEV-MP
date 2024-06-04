export const makeUserView = (document) => {
    if (document == null)
        return {};
    return {
        id : document.Id,
        firstName: document.FirstName,
        lastName: document.LastName,
        username: document.Username,
        mobileNumber : document.MobileNumber,
        email : document.Email,
        role: document.Role,
    };
}

export const makeUserArrayView = (documents) => {
    return documents.map((val) => {
        return makeUserView(val)
    });
}