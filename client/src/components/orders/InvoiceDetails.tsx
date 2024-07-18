export interface InvoiceRequest {
    pdfFile: File | null;
}

export interface Invoice {
    id: string;
    pdfFile: string;
}
