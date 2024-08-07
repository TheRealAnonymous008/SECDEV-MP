import { useEffect, useState } from "react";
import { CreateExpense } from './CreateExpense';
import { Expense } from "./ExpenseDetails";
import { ExpenseRecord } from "./ExpenseRecord";
import { ViewHandler } from "../view/ViewHandler";
import { isRole } from "../../utils/CheckRole";
import { TableBody, TableHead } from "../../style/TableStyle";
import { CreateButton } from "../../style/CreateButton";
import { ENDPOINTS } from "../../api/endpoints";

const searchOptions = [
    {name: "InvoiceAmount", description:"The amount associated with the invoice"},
    {name: "InvoiceDeductible", description: "The amount deductible from the invoice"},
    {name: "AgentFirstName", description: "The first name of the agent associated with the expense"},
    {name: "AgentLastName", description: "The last name of the agent associated with the expense"},
    {name: "DatePaid", description: "The date the amount was paid"},
    {name: "AgentCommission", description: "The commission received by the agent-in-charge"},
]


const ViewExpenses = () => {

    const [expenses, setExpenses] = useState([]);
    const [queryResult, setQueryResult] = useState([]);

    const [flag, setFlag] = useState(false);

    const updateView = () => {
        setFlag(!flag);
    }

    useEffect(() => { 
        setExpenses(queryResult);
    }, [queryResult]);

    return (
        <div>
            <ViewHandler path={ENDPOINTS.filterExpense} all={ENDPOINTS.expenses} setData={setQueryResult} queryParser={queryParser} flag={flag} options={searchOptions}>
                <br />
                <table>
                    <TableHead>
                        <tr>
                            <td> Invoice Amount </td>
                            <td> Invoice Deductible </td>
                            <td> Agent First Name </td>
                            <td> Agent Last Name </td>
                            <td> Date Paid </td>
                            <td> Agent Commission </td>

                            <th hidden={isRole("VIEW")}></th>
                            <th hidden={isRole("VIEW")}></th>
                        </tr>
                    </TableHead>
                
                    <TableBody>
                        {expenses.map((value, index) => {
                            return (<ExpenseRecord expense={value} key={index} rerenderFlag={() => {setFlag(!flag)}}/>);
                        })}
                    </TableBody>
                </table>
                <br />
                <div hidden={isRole("VIEW")}>
                    <CreateButton hidden={isRole("VIEW")}>
                        <CreateExpense observer={updateView}/>
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
        InvoiceAmount: 0,
        InvoiceDeductible: 0,
        AgentFirstName: "",
        AgentLastName: "",
        DatePaid: "",
        AgentCommission: 0
    };

    for(let i = 0; i < toks.length; ++i){
        const subtoks = toks[i].split(":");
        const key = subtoks[0].trim();
        const value = subtoks[1];

        if (key === "InvoiceAmount"){
            query.InvoiceAmount = Number(value?.trim());
        }
        else if (key === "InvoiceDeductible"){
            query.InvoiceDeductible = Number(value?.trim());
        }
        else if (key === "AgentFirstName"){
            query.AgentFirstName = value?.trim();
        }
        else if (key === "AgentLastName"){
            query.AgentLastName = value?.trim();
        }
        else if (key === "DatePaid"){
            query.DatePaid = value?.trim();
        }
        else if (key === "AgentCommission"){
            query.AgentCommission = Number(value?.trim());
        }
    }

    return query;
}



export default ViewExpenses;