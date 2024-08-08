import { ExpDelContainer, ExpDelIcon } from "../../style/DeleteButton";
import { Complaint } from "./ComplaintDetails";
import { ENDPOINTS } from "../../api/endpoints";
import { createAPIEndpoint } from "../../api";

export const DeleteComplaint = (props : { complaint: Complaint, observer : Function, index : number}) => {
    const onClick = () => {
        createAPIEndpoint(ENDPOINTS.deleteComplaint).delete({"id" : props.complaint.Id})
            .then((response) => {
                props.observer();
            })
            .catch((err) => {
                console.log(err)
            });
    }

    return (
        <ExpDelContainer>
            <button onClick={onClick}><ExpDelIcon></ExpDelIcon></button>
        </ExpDelContainer>
    );
} 