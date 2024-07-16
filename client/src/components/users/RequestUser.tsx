import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createAPIEndpoint } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";
import { FormDivStyle } from "../../style/FormStyle";
import { isAlphabetic } from "../../utils/Regex";
import { UserRequest } from "./UserDetails";
import * as regexes from "./InputValidation";

export const DEFAULT = "DEFAULT";

export const RequestUser = (props : {setResponse : Function, default? : UserRequest}) => {
    
    const {register, watch, handleSubmit, formState: {errors}, setValue} = useForm<UserRequest>({mode: "onBlur"});
    const [roles, setRoles] = useState<Array<string>>(["Employee"]);

    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.userRoles).fetch()
            .then((response) => {
                return response.data;
            })
            .then((response: Array<string>) => {
                setRoles(response);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (props.default){
            setValue("firstName", props.default.firstName)
            setValue("lastName", props.default.lastName)
            setValue("id", props.default.id)
            setValue("role", props.default.role)
            setValue("username", props.default.username)
            setValue("email", props.default.email)
            setValue("mobileNumber", props.default.mobileNumber);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.default])

    
    const onSubmit = handleSubmit((data) => {
        props.setResponse(data);
    });

    return (
        <FormDivStyle>
            <p><u>-- User --</u></p>
            <br />
            <br />
            <form onSubmit={onSubmit} autoComplete="Off">
                <div>
                    <label htmlFor="firstName"> First Name </label>
                    <input {... register("firstName", {required : true, pattern: regexes.nameRegex })}
                    type="text" name = "firstName" defaultValue={props.default?.firstName}/>
                    {errors.firstName && <p>User First Name is required</p>}
                </div>
                <div>
                    <label htmlFor="lastName"> Last Name </label>
                    <input {... register("lastName", {required : true, pattern: regexes.nameRegex })}
                    type="text" name = "lastName" defaultValue={props.default?.lastName}/>
                    {errors.lastName && <p>User Last Name is required</p>}
                </div>
                <div>
                    <label htmlFor="username"> Username </label>
                    <input {... register("username", {required : true, pattern: regexes.usernameRegex })}
                    type="text" name = "username" defaultValue={props.default?.username}/>
                    {errors.username && <p>Username is required</p>}
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input {...register("email", {required : true, pattern: regexes.emailRegex })}
                        type="email" name="email" defaultValue={props.default?.email}/>
                    {errors.email && <p>Email is required</p>}
                </div>
                <div>
                    <label htmlFor="mobile">Mobile Number</label>
                    <input {...register("mobileNumber", {required : true })}
                        type="text" name="mobileNumber" defaultValue={props.default?.mobileNumber}/>
                    {errors.mobileNumber && <p>Mobile number is required and must be 11 digits</p>}
                </div>
                <div>
                    <label>User Role</label>
                    <select {...register('role', {required: false, validate: {
                        isNotDefault: (v) => {return v !== DEFAULT} 
                    }})} value={watch("role") ? watch("role") : DEFAULT}>
                        <option value={DEFAULT} disabled>-- Select Role --</option>
                        {
                            roles.map((value, index) => {
                                return (
                                    <option key={index + 1}
                                        value={value}> {value} </option>
                                );
                            })
                        }
                    </select>
                    {errors.role && <p> Role is required </p>}
                </div>

                <br /><br />

                <input type='button' name="submit" onClick={onSubmit}value={"SUBMIT"} />
            </form>
        </FormDivStyle> 
    );
}