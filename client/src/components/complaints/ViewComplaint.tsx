import { useEffect, useState } from "react";
import { CreateComplaint } from './CreateComplaint';
import { Complaint } from "./ComplaintDetails";
import { ComplaintRecord } from "./ComplaintRecord";
import { ViewHandler } from "../view/ViewHandler";
import { isRole } from "../../utils/CheckRole";
import { TableBody, TableHead } from "../../style/TableStyle";
import { CreateButton } from "../../style/CreateButton";
import { ENDPOINTS } from "../../api/endpoints";

const searchOptions = [
    {name: "Description", description:"The description of the complaint"},
]


const ViewComplaint = () => {

    const [complaint, setComplaint] = useState([]);
    const [queryResult, setQueryResult] = useState([]);

    const [flag, setFlag] = useState(false);

    const updateView = () => {
        setFlag(!flag);
    }

    useEffect(() => { 
        setComplaint(queryResult);
    }, [queryResult]);

    return (
        <div>
            <ViewHandler path={ENDPOINTS.filterComplaint} all={ENDPOINTS.complaints} setData={setQueryResult} queryParser={queryParser} flag={flag} options={searchOptions}>
                <br />
                <table>
                    <TableHead>
                        <tr>
                            <td> Description </td>
                            <td> Date Reported </td>
                            

                            <th hidden={isRole("VIEW")}></th>
                        </tr>
                    </TableHead>
                
                    <TableBody>
                        {complaint.map((value, index) => {
                            return (<ComplaintRecord complaint={value} key={index} rerenderFlag={() => {setFlag(!flag)}}/>);
                        })}
                    </TableBody>
                </table>
                <br />
                <div hidden={isRole("VIEW")}>
                    <CreateButton hidden={isRole("VIEW")}>
                        <CreateComplaint observer={updateView}/>
                    </CreateButton>
                </div>
           
            </ViewHandler>
        </div>      
    );
}


const queryParser = (q : string) => {
    const toks = q.split(',');
    const query = {
        skip: 0,
        limit: 1000,
        Description: "",
        DateReported: "",
    };

    for(let i = 0; i < toks.length; ++i){
        const subtoks = toks[i].split(":");
        const key = subtoks[0].trim();
        const value = subtoks[1];

        if (key === "Description"){
            query.Description = value?.trim();
        }
        else if (key === "DateReported"){
            query.DateReported = value?.trim();
        }
        
    }

    return query;
}



export default ViewComplaint;