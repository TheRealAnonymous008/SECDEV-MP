import { RowDataPacket } from "mysql2";

export default interface Complaint extends RowDataPacket {
    Id: number;
    Description: string;
    DateReported: string;
}

export interface ComplaintRow {
    Description?: string;
    DateReported?: string;
}
