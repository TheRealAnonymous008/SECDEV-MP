"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeEnum = exports.StatusEnum = exports.ALL_ROLES = exports.RoleIds = exports.Roles = void 0;
exports.Roles = {
    ADMIN: "ADMIN",
    VIEW_EDIT: "VIEW_EDIT",
    VIEW: "VIEW"
};
exports.RoleIds = {
    ADMIN: 1,
    VIEW_EDIT: 2,
    VIEW: 3,
};
exports.ALL_ROLES = ["ADMIN", "VIEW_EDIT", "VIEW"];
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
