import { useState } from "react";
import { createAPIEndpoint } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";
import { ModalWrapper } from "../base/ModalBase";
import { RequestComplaint } from './RequestComplaint';

export const CreateComplaint = (props : {observer : Function}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const setData = (data : any) => {
        createAPIEndpoint(ENDPOINTS.addComplaint).post(data)
        .then((response) => {
            props.observer();
            setIsVisible(false);
        })
        .catch(function (error) {
            console.log(error);
        })
    };

    return (
        <div>
            <ModalWrapper front={"Create Complaint"} isVisible={isVisible} setIsVisible={setIsVisible}>
                <RequestComplaint setResponse={setData}/>
            </ModalWrapper> 
        </div>
        
    );
}