import { useForm } from 'react-hook-form';
import { FormDivStyle } from '../../style/FormStyle';
import { ExpenseRequest } from './ExpenseDetails';

export const RequestExpense = (props : {setResponse : Function, default? : ExpenseRequest, isInForm? : boolean}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<ExpenseRequest>();
    const isInFormComponent = props.isInForm || true; // Default to true if not provided

    const onSubmit = handleSubmit((data) => {
        props.setResponse(data);
    });

    return (
        <FormDivStyle>
            <p><u>-- Expense --</u></p>
            {!isInFormComponent &&
                <form onSubmit={onSubmit} autoComplete="off">
                    <RequestExpenseForm errors={errors} register={register} default={props.default} />
                    <input type='button' value="SUBMIT" onClick={onSubmit} />
                </form>
            }
            {isInFormComponent &&
                <div onSubmit={onSubmit}>
                    <RequestExpenseForm errors={errors} register={register} default={props.default} />
                    <input type='button' value="SUBMIT" onClick={onSubmit} />
                </div>
            }
            <br /><br />
        </FormDivStyle>
    );
};

const RequestExpenseForm = ({ register, errors, default: defaultExpense }: { register: any, errors: any, default?: ExpenseRequest }) => {
    return (
        <div>
            <br />
            <div>
                <label htmlFor="InvoiceAmount">Invoice Amount</label>
                <input {...register('InvoiceAmount', { required: true })} type="number" name="InvoiceAmount" defaultValue={defaultExpense?.InvoiceAmount} autoComplete="off" />
                {errors.InvoiceAmount && <p>Invoice Amount is required</p>}
            </div>
            <div>
                <label htmlFor="InvoiceDeductible">Invoice Deductible</label>
                <input {...register('InvoiceDeductible', { required: true })} type="number" name="InvoiceDeductible" defaultValue={defaultExpense?.InvoiceDeductible} autoComplete="off" />
                {errors.InvoiceDeductible && <p>Invoice Deductible is required</p>}
            </div>
            <div>
                <label htmlFor="AgentFirstName">Agent First Name</label>
                <input {...register('AgentFirstName', { required: true })} type="text" name="AgentFirstName" defaultValue={defaultExpense?.AgentFirstName} autoComplete="off" />
                {errors.AgentFirstName && <p>Agent First Name is required</p>}
            </div>
            <div>
                <label htmlFor="AgentLastName">Agent Last Name</label>
                <input {...register('AgentLastName', { required: true })} type="text" name="AgentLastName" defaultValue={defaultExpense?.AgentLastName} autoComplete="off" />
                {errors.AgentLastName && <p>Agent Last Name is required</p>}
            </div>
            <div>
                <label htmlFor="DatePaid">Date Paid</label>
                <input {...register('DatePaid', { required: true })} type="date" name="DatePaid" defaultValue={defaultExpense?.DatePaid} autoComplete="off" />
                {errors.DatePaid && <p>Date Paid is required</p>}
            </div>
            <div>
                <label htmlFor="AgentCommission">Agent Commission</label>
                <input {...register('AgentCommission', { required: true })} type="number" name="AgentCommission" defaultValue={defaultExpense?.AgentCommission} autoComplete="off" />
                {errors.AgentCommission && <p>Agent Commission is required</p>}
            </div>
            <br /><br />
        </div>
    );
};
