import { useState } from "react";
import { InvoiceText } from "../../style/InvoiceStyle";
import { DateEntry } from "../base/DateEntry";
import { ModalWrapper } from "../base/ModalBase";
import { NumberEntry } from "../base/NumberEntry";
import { Invoice } from "./InvoiceDetails"

export const InvoiceDisplay = (props: { invoice?: Invoice }) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    if (props.invoice) {
        return (
            <>
                <div>
                    <ModalWrapper front={"View PDF"} isVisible={isVisible} setIsVisible={setIsVisible}>
                        <DetailedInvoice invoice={props.invoice} />
                    </ModalWrapper>
                </div>
            </>
        );
    }
    return null;
};

const DetailedInvoice = (props: { invoice?: Invoice }) => {
    if (props.invoice && props.invoice.pdfFile) {
        return (
            <InvoiceText>
                <iframe title="Uploaded PDF" src={props.invoice.pdfFile} width="100%" height="400px"></iframe>
            </InvoiceText>
        );
    }
    return null;
};
