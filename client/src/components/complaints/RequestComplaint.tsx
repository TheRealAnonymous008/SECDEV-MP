import { useForm } from 'react-hook-form';
import { FormDivStyle } from '../../style/FormStyle';
import { ComplaintRequest } from './ComplaintDetails';

export const RequestComplaint = (props : {setResponse : Function, default? : ComplaintRequest, isInForm? : boolean}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<ComplaintRequest>();
    const isInFormComponent = props.isInForm || true; // Default to true if not provided

    const onSubmit = handleSubmit((data) => {
        props.setResponse(data);
    });

    return (
        <FormDivStyle>
            <p><u>-- Complaints --</u></p>
            {!isInFormComponent &&
                <form onSubmit={onSubmit} autoComplete="off">
                    <RequestComplaintForm errors={errors} register={register} default={props.default} />
                    <input type='button' value="SUBMIT" onClick={onSubmit} />
                </form>
            }
            {isInFormComponent &&
                <div onSubmit={onSubmit}>
                    <RequestComplaintForm errors={errors} register={register} default={props.default} />
                    <input type='button' value="SUBMIT" onClick={onSubmit} />
                </div>
            }
            <br /><br />
        </FormDivStyle>
    );
};

const RequestComplaintForm = ({ register, errors, default: defaultComplaint }: { register: any, errors: any, default?: ComplaintRequest }) => {
    return (
        <div>
            <br />
            <div>
                <label htmlFor="Description">Description</label>
                <input {...register('Description', { required: true })} type="text" name="Description" defaultValue={defaultComplaint?.Description} autoComplete="off" />
                {errors.Description && <p>Description is required</p>}
            </div>
            <div>
                <label htmlFor="DateReported">Date Reported</label>
                <input {...register('DateReported', { required: true })} type="date" name="DateReported" defaultValue={defaultComplaint?.DateReported} autoComplete="off" />
                {errors.DateReported && <p>Date Reported is required</p>}
            </div>
            <br /><br />
        </div>
    );
};
