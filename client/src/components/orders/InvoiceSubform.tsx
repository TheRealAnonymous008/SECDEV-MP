import { useState } from "react";
import { ModalWrapper } from "../base/ModalBase";

export const InvoiceSubform = (props: {setValue : any, errors : any}) => {
    const errors = props.errors;
    const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
    const [showPdfViewer, setShowPdfViewer] = useState<boolean>(false);
    const [pdfSrc, setPdfSrc] = useState<string>('');

    const onSubmit = () => {
        props.setValue(selectedPdf);
        setIsVisible(false);
    };

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