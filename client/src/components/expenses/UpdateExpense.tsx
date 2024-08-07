import { useState, useEffect } from "react";
import { createAPIEndpoint } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";
import { EditButton } from "../../style/EditButton";
import { isRole } from "../../utils/CheckRole";
import { ModalWrapper } from "../base/ModalBase";
import { Expense, ExpenseRequest } from "./ExpenseDetails";
import { RequestExpense } from "./RequestExpense";


export const UpdateExpense = (props : {expense : Expense, observer : Function}) => {
    const [data, setData] = useState<ExpenseRequest>();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    
    useEffect(() => {
        if (data == undefined)
            return;
        if (isRole("VIEW"))
            return;

        createAPIEndpoint(ENDPOINTS.updateExpense).post(data, {id: props.expense.Id})
        .then(function (response) {
            props.observer();
            setIsVisible(false);
        })
        .catch(function (error) {
            console.log(error);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <EditButton>
          <ModalWrapper front={"Edit"} isVisible={isVisible} setIsVisible={setIsVisible}>
            <RequestExpense setResponse={setData} 
                default={props.expense}
                />
          </ModalWrapper>
        </EditButton>
    )
}