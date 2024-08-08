import { RowDataPacket } from "mysql2";

export interface IEnum extends RowDataPacket {
    Id: number;
    Name: string;
}

export const getEnumNames = (enums: IEnum[]) => {
    return enums.map((value) => {return value.Name})
}
