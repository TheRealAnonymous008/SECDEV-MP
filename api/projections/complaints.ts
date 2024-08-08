export const makeComplaintView = (document) => {
    if (document == null)
        return {};

    return {
        Id: document.Id,
        Description: document.Description,
        DateReported: document.DateReported
    };
}

export const makeComplaintArrayView = (documents) => {
    return documents.map((val) => {
        return makeComplaintView(val);
    });
}
