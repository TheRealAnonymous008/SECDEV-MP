export interface InvoiceRequest {
    pdfFile: File | string | null;
}

export interface Invoice {
    id: string;
    pdfFile: string;
}
