export interface Complaint {
    Id: number;
    Description: string;
    DateReported: string;
}

export interface ComplaintRequest {
    Description: string;
    DateReported: string;
}