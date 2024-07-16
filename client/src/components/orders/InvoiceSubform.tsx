import { useEffect, useState } from "react";
import { ConvertDate } from "../../utils/ConvertDate";
import { ModalWrapper } from "../base/ModalBase";
import { InvoiceRequest } from "./InvoiceDetails";
import { ENDPOINTS } from "../../api/endpoints";

const DEFAULT_INVOICE = {
    agentCommission: 0,
    agentLastName: "",
    agentFirstName: "",
    amount: 0,
    datePaid: new Date(),
    deductible: 0,
    pdfFile: null
}

export const InvoiceSubform = (props: {setValue : any, errors : any, default? : InvoiceRequest}) => {
    const errors = props.errors;
    const [invoice, setInvoice] = useState<InvoiceRequest>(props.default ? props.default : DEFAULT_INVOICE);
    const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
    const [showPdfViewer, setShowPdfViewer] = useState<boolean>(false);
    const [pdfSrc, setPdfSrc] = useState<string>('');

    useEffect(() => {
        if (props.default) {
            setInvoice(props.default);
        } else {
            setInvoice(DEFAULT_INVOICE);
        }

    }, [props.default])

    const onSubmit = () => {
        props.setValue({...invoice, pdfFile: selectedPdf});
        setIsVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    const [isVisible, setIsVisible] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedPdf(e.target.files[0]);
            setPdfSrc(URL.createObjectURL(e.target.files[0])); // Create URL for PDF
            setShowPdfViewer(true);
        }
    };

    return (
        <ModalWrapper front={"Add Invoice"} isVisible={isVisible} setIsVisible={setIsVisible}>
            <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '20px' }}>
                {/* Deactivating invoice fields except pdf for now */}
                {/* <div>
                    <br />
                    <label htmlFor="invoiceAmount">Invoice Amount</label>
                    <input type='text' name="invoice.amount" id="invoice.amount"
                        defaultValue={invoice.amount.toString()}
                        onChange={
                            (e) => {setInvoice({...invoice, amount: parseFloat(e.target.value)})}
                        }
                    />
                    {errors.invoice?.amount && <p>Invoice amount has wrong format</p>}
                </div>

                <div>
                    <label htmlFor="invoiceDeductible">Invoice Deductible</label>
                    <input type='text' name="invoice.deductible" id="invoice.deductible"
                        defaultValue={invoice.deductible.toString()}
                        onChange={
                            (e) => {setInvoice({...invoice, deductible: parseFloat(e.target.value)})}
                        }
                    />
                    {errors.invoice?.deductible && <p>Deductible has wrong format</p>}
                </div>

                <div>
                    <label htmlFor="agentFirstName">Agent First Name</label>
                    <input type='text' name="invoice.agentFirstName" id="invoice.agentFirstName"
                        defaultValue={invoice.agentFirstName}
                        onChange={
                            (e) => {setInvoice({...invoice, agentFirstName: e.target.value})}
                        }
                    />
                    {errors.invoice?.agentFirstName && <p>Agent first name has wrong format</p>}
                </div>

                <div>
                    <label htmlFor="agentLastName">Agent Last Name</label>
                    <input  type='text' name="invoice.agentLastName" id="invoice.agentLastName"
                        defaultValue={invoice.agentLastName}
                        onChange={
                            (e) => {setInvoice({...invoice, agentLastName: e.target.value})}
                        }
                    />
                    {errors.invoice?.agentLastName && <p>Agent last name has wrong format</p>}
                </div> 

                <div>
                    <label htmlFor="datePaid">Date Paid</label>
                    <input  
                        defaultValue = {
                            invoice.datePaid ? 
                            (invoice.datePaid.valueOf() === 0 ? "mm-dd-yyyy" : ConvertDate(invoice.datePaid)) : ""
                        }
                        onChange={
                            (e) => {setInvoice({...invoice, datePaid: new Date(e.target.value)})}
                        }
                    type ="date" name="invoice.datePaid" id="invoice.datePaid"/>
                    {errors.invoice?.datePaid && <p>Date is invalid</p>}
                </div>

                <div>
                    <label htmlFor="invoiceAgentCommision">Agent Commission</label>
                    <input type='text' name="invoice.agentCommission" id="invoice.agentCommission"
                        defaultValue={
                            invoice.agentCommission.toString()
                        }
                        onChange={
                            (e) => {setInvoice({...invoice, agentCommission: parseFloat(e.target.value)})}
                        }
                    />
                    {errors.invoice?.agentCommission && <p>Agent Commission has wrong format</p>}
                </div>
                */}

                <div>
                    <label htmlFor="pdfUpload">PDF File</label>
                    <input type="file" name="pdfFile" id="pdfUpload" accept=".pdf"
                        onChange={handleFileChange}
                    />
                    {selectedPdf && <p>Selected PDF: {selectedPdf.name}</p>}
                    {showPdfViewer && (
                        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                            <iframe title="Uploaded PDF" src={pdfSrc} width="100%" height="400px"></iframe>
                        </div>
                    )}
                </div>

                <br />
                <br />
                
                <input type='button' name="submit" onClick={onSubmit}value={"Submit"} />
            </div>
        </ModalWrapper>
    )
}