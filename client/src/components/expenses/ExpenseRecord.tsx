import { Expense } from "./ExpenseDetails";
import { DeleteExpense } from "./DeleteExpense";
import { UpdateExpense } from "./UpdateExpense";
import { useEffect, useState } from "react";
import { createAPIEndpoint } from "../../api";
import { isRole } from "../../utils/CheckRole";
import { ENDPOINTS } from "../../api/endpoints";
import { DateEntry } from "../base/DateEntry";


export const ExpenseRecord = (props : { expense: Expense, rerenderFlag: Function}) => {
    const [expense, setExpense] = useState<Expense | null>(props.expense);

    useEffect(() => {
        if (props && props.expense){
            setExpense(props.expense);
        } else {
            setExpense(null);
        }
    }, [props, props.expense])

    const onUpdate = () => {
        createAPIEndpoint(ENDPOINTS.getExpense).fetch({id : props.expense.Id})
        .then((response) => {
            setExpense(response.data);
        });
    };

    const onDelete = () => {
        props.rerenderFlag();
    }

    if (expense) {
        return ( 
            <tr>
                <td> {expense?.InvoiceAmount} </td>
                <td> {expense?.InvoiceDeductible} </td>
                <td> {expense?.AgentFirstName} </td>
                <td> {expense?.AgentLastName} </td>
                <td> <DateEntry date={expense?.DatePaid}/></td>
                <td> {expense?.AgentCommission} </td>
                <td hidden={isRole("VIEW")}> <UpdateExpense expense={expense} observer={onUpdate}/></td>
                <td hidden={isRole("VIEW")}> <DeleteExpense expense={expense} observer={onDelete} index={expense.Id}/></td>
            </tr> 
        );
    } else {
        return null;
    }
}