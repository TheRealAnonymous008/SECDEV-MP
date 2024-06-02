export const Roles = {
    ADMIN: 1,
    VIEW_EDIT: 2,
    VIEW: 3
};

export const ALL_ROLES = [Roles.ADMIN, Roles.VIEW_EDIT, Roles.VIEW];

export const StatusEnum = [
    "PAID", 
    "UNPAID", 
    "OK", 
    "PENDING", 
    "WITH BALANCE", 
    "QUOTE OR CHECK", 
    "FOR LOA OR INVOICE"
];

export const TypeEnum = [
    "PERSONAL",
    "WALK IN",
    "FLEET",
    "INSURANCE"
]