import { useState, useEffect } from "react";
import { createAPIEndpoint } from "../../api";
import { ENDPOINTS } from "../../api/endpoints";
import { isRole } from "../../utils/CheckRole";
import { DeleteUser } from "./DeleteUser";
import { UpdateUser } from "./UpdateUser";
import { User } from "./UserDetails";
import { roleMap } from "../../utils/RoleMapping";

export const UserRecord = (props : { user: User, rerenderFlag: Function}) => {
    const [user, setUser] = useState<User | null>(props.user);

    useEffect(() => {
        if (props && props.user){
            setUser(props.user);
        } else {
            setUser(null);
        }
    }, [props, props.user])

    const onUpdate = () => {
        createAPIEndpoint(ENDPOINTS.getUser).fetch({id : props.user.id})
        .then((response) => {
            const roleKey = response.data.role as unknown as number;
            const updateUser = {...response.data, role: roleMap[roleKey]};

            setUser(updateUser);
        })
    };

    const onDelete = () => {
        props.rerenderFlag();
    }

    if (user) {
    return (
            <tr>
                <td> {user?.firstName} </td>
                <td> {user?.lastName} </td>
                <td> {user?.username} </td>
                <td> {user?.email} </td> 
                <td> {user?.mobileNumber} </td>
                <td> {user?.role} </td>
                <td hidden={isRole("VIEW") || isRole("VIEW_EDIT")}> <UpdateUser user={user} observer={onUpdate}/></td>
                <td hidden={isRole("VIEW") || isRole("VIEW_EDIT")}> <DeleteUser user={user} observer={onDelete}/></td>
            </tr> 
        );
    }
     else {
        return null;
    }
}