import React, { useState } from 'react';
import { createAPIEndpoint} from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../api/routes';
import { SignBox, LoginDiv, SignPage, RightImage, SignUp } from '../style/SignStyle';
import { RedDialogue } from '../style/Dialogue';
import { ENDPOINTS } from '../api/endpoints';
import { set } from 'react-hook-form';


type LoginState = {
    username: string
    password: string
};

const Login = (props: {setIsLoggedIn : Function}) => {
    const [state, setState] = useState<LoginState>({
        username: "",
        password: ""
    });

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    
    const navigation = useNavigate();

    const onSubmit = (event: React.SyntheticEvent<HTMLInputElement>) => {

        if (!state.username) {
            setUsernameError("Username is required.");
            return;
        }
        setUsernameError("");

        if (!state.password) {
            setPasswordError("Password is required.");
            return;
        }
        setPasswordError("");

        createAPIEndpoint(ENDPOINTS.login).post(state)
            .then((response) => {
                if(response.data.auth) {
                    props.setIsLoggedIn(true);
                    sessionStorage.setItem("isLoggedIn", "true");
                    navigation(ROUTES.orders);
                }
                else {
                    props.setIsLoggedIn(false);
                    sessionStorage.setItem("isLoggedIn", "false");
                }
                
            })
            .catch((err: any) => {
                console.log(err);
            });
        event.preventDefault();
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
                        <span>
                            <input
                                name="username"
                                value={state.username}
                                placeholder="Username"
                                onChange={(e) => { onInputChange("username", e.target.value); }} />
                            {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
                        </span>
                        <span>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={state.password}
                                onChange={(e) => { onInputChange("password", e.target.value); }} />
                            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
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