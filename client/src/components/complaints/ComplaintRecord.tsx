import { Complaint } from "./ComplaintDetails";
import { DeleteComplaint } from "./DeleteComplaint";
import { useEffect, useState } from "react";
import { createAPIEndpoint } from "../../api";
import { isRole } from "../../utils/CheckRole";
import { ENDPOINTS } from "../../api/endpoints";
import { DateEntry } from "../base/DateEntry";


export const ComplaintRecord = (props : { complaint: Complaint, rerenderFlag: Function}) => {
    const [complaint, setComplaint] = useState<Complaint | null>(props.complaint);

    useEffect(() => {
        if (props && props.complaint){
            setComplaint(props.complaint);
        } else {
            setComplaint(null);
        }
    }, [props, props.complaint])

    const onDelete = () => {
        props.rerenderFlag();
    }

    if (complaint) {
        return ( 
            <tr>
                <td> {complaint?.Description} </td>
                <td> <DateEntry date={complaint?.DateReported}/></td>
                
                <td hidden={isRole("VIEW")}> <DeleteComplaint complaint={complaint} observer={onDelete} index={complaint.Id}/></td>
            </tr> 
        );
    } else {
        return null;
    }
}