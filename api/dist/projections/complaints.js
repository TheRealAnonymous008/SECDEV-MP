"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeComplaintArrayView = exports.makeComplaintView = void 0;
const makeComplaintView = (document) => {
    if (document == null)
        return {};
    return {
        Id: document.Id,
        Description: document.Description,
        DateReported: document.DateReported
    };
};
exports.makeComplaintView = makeComplaintView;
const makeComplaintArrayView = (documents) => {
    return documents.map((val) => {
        return (0, exports.makeComplaintView)(val);
    });
};
exports.makeComplaintArrayView = makeComplaintArrayView;
