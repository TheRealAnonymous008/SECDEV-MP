import React, { useEffect, useState } from 'react';
import { createAPIEndpoint} from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../api/routes';
import { SignBox, LoginDiv, SignPage, RightImage, SignUp } from '../style/SignStyle';
import { RedDialogue } from '../style/Dialogue';
import { ENDPOINTS } from '../api/endpoints';
import jwtDecode from 'jwt-decode';

type LoginState = {
    username: string
    password: string
};

const Login = (props: {isLoggedIn : boolean, setIsLoggedIn : Function, setIsAdmin : Function}) => {
    const [state, setState] = useState<LoginState>({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");
    
    const navigation = useNavigate();

    useEffect(() => {
        if (props.isLoggedIn)
            navigation(ROUTES.orders)
    })

    const onSubmit = (event: React.SyntheticEvent<HTMLInputElement>) => {
        event.preventDefault();

        if (!state.username) {
            setError("Username is required.");
            return;
        }

        if (!state.password) {
            setError("Password is required.");
            return;
        }

        createAPIEndpoint(ENDPOINTS.login).post(state)
            .then((response) => {
                if(response.data.auth) {
                    props.setIsLoggedIn(true);
                    const decoded : any = jwtDecode(response.data.token)
                    props.setIsAdmin(decoded.role === "1")
                    navigation(ROUTES.orders);
                }
                else {
                    props.setIsLoggedIn(false);
                    props.setIsAdmin(false)
                    setError("Username or Password does not match.");
                }
                
            })
            .catch((err: any) => {
                console.log(err);
                setError("An error occurred. Please try again.");
            });
    };

    const onInputChange = (name : string, value : any) => {
        setState(values => ({ ...values, [name]: value }));
    }

    return (
        <SignPage>
            <SignBox>
                <div className='LoginLogo'></div>
                <RightImage></RightImage>
                <LoginDiv>
                    <form autoComplete="off">
                    {error && <p style={{ color: 'red', marginLeft: '0.5rem' }}>{error}</p>}
                        <span>
                            <input
                                name="username"
                                value={state.username}
                                placeholder="Username"
                                onChange={(e) => { onInputChange("username", e.target.value); }} />
                        </span>
                        <span>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={state.password}
                                onChange={(e) => { onInputChange("password", e.target.value); }} />
                        </span>
                        <span>
                            <input
                                type='button' name="submit" onClick={onSubmit} value={"Sign In"} />
                        </span>
                        <SignUp>
                            <p> Don't have an account? &nbsp;
                                <span>
                                    <Link to= {ROUTES.register}>
                                        <RedDialogue>Sign up now.</RedDialogue>
                                    </Link>
                                </span>
                            </p>
                        </SignUp>
                    </form>
                </LoginDiv>
            </SignBox>
        </SignPage>
    );
}

export default Login;