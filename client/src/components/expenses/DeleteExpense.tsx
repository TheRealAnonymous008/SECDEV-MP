import { ExpDelContainer, ExpDelIcon } from "../../style/DeleteButton";
import { Expense } from "./ExpenseDetails";
import { ENDPOINTS } from "../../api/endpoints";
import { createAPIEndpoint } from "../../api";

export const DeleteExpense = (props : { expense: Expense, observer : Function, index : number}) => {
    const onClick = () => {
        createAPIEndpoint(ENDPOINTS.deleteExpense).delete({"id" : props.expense.Id})
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