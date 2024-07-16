import { RowDataPacket } from "mysql2";

export interface IEnum extends RowDataPacket {
    Id: number;
    Name: string;
}

export const getEnumNames = (enums: IEnum[]) => {
    return enums.map((value) => {return value.Name})
}


// export interface IRoleIds {
//     ADMIN: number;
//     VIEW_EDIT: number;
//     VIEW: number;
// }

// export interface IAllRoles {
//     ADMIN: string;
//     VIEW_EDIT: string;
//     VIEW: string;
// }

// export interface IStatusEnumNames {
//     PAID: string;
//     UNPAID: string;
//     OK: string;
//     PENDING: string;
//     WITH_BALANCE: string;
//     QUOTE_OR_CHECK: string;
//     FOR_LOA_OR_INVOICE: string;
// }

// export interface ITypeEnumNames {
//     PERSONAL: string;
//     WALK_IN: string;
//     FLEET: string;
//     INSURANCE: string;
// }
