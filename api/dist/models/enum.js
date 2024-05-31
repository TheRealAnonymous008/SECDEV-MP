"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeEnum = exports.StatusEnum = exports.ALL_ROLES = exports.Roles = void 0;
exports.Roles = {
    ADMIN: 1,
    VIEW_EDIT: 2,
    VIEW: 3
};
exports.ALL_ROLES = [exports.Roles.ADMIN, exports.Roles.VIEW_EDIT, exports.Roles.VIEW];
exports.StatusEnum = [
    "PAID",
    "UNPAID",
    "OK",
    "PENDING",
    "WITH BALANCE",
    "QUOTE OR CHECK",
    "FOR LOA OR INVOICE"
];
exports.TypeEnum = [
    "PERSONAL",
    "WALK IN",
    "FLEET",
    "INSURANCE"
];
