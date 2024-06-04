"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserArrayView = exports.makeUserView = void 0;
const makeUserView = (document) => {
    if (document == null)
        return {};
    return {
        id: document.Id,
        firstName: document.FirstName,
        lastName: document.LastName,
        username: document.Username,
        mobileNumber: document.MobileNubmer,
        email: document.Email,
        role: document.Role,
    };
};
exports.makeUserView = makeUserView;
const makeUserArrayView = (documents) => {
    return documents.map((val) => {
        return (0, exports.makeUserView)(val);
    });
};
exports.makeUserArrayView = makeUserArrayView;
