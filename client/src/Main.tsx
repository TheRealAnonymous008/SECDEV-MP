import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import ViewCustomers from "./components/customers/ViewCustomers";
import Home from "./components/Home";
import Login from "./components/Login";
import OrdersView from "./components/orders/ViewOrders";
import Register from "./components/Register";
import ViewVehicles from "./components/vehicles/ViewVehicles";
import "./style/temporary.css";
import { ROUTES } from "./api/routes";
import UsersView from "./components/users/ViewUsers";
import { useEffect, useState } from "react";
import {Logout} from "./utils/Logout";  
import { WithNav } from "./WithNav";
import UserProfile from "./components/profile/UserProfile";
import { createAPIEndpoint } from "./api";
import { ENDPOINTS } from "./api/endpoints";
import { useAsync } from "react-async";



const ProtectedRoute = (props : { isLoggedIn : boolean}) => {
    if (!props.isLoggedIn) {
      return (<Navigate to="/login"/>);    
    }
    return <Outlet/>
};

export const Main = () => {
    const [isLoggedIn ,setIsLoggedIn] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>(false) 
    const navigate = useNavigate()

    useAsync(async () => {
        await createAPIEndpoint(ENDPOINTS.handshake).fetch()
            .then((response) => {
                if (response.status != 403){
                    setIsLoggedIn(true)
                    setIsAdmin(response.data.Role == "ADMIN")
                    navigate(ROUTES.orders)
                }
                else {
                    setIsLoggedIn(false)
                    setIsAdmin(false)
                    console.log("This ran")
                    navigate(ROUTES.login)
                }
            })
            .catch((err) => {
                navigate(ROUTES.login)
            })
        }, []
    );
    
    return (    
        <Routes>
                <>
                    <Route
                        path={ROUTES.login}
                        element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin}/> }
                    />

                    <Route
                        path={ROUTES.register }
                        element={<Register/> }
                    />
                </>
            
                <Route element={<WithNav isAdmin = {isAdmin}/>}>
                    <Route path={ROUTES.customers} element={<ProtectedRoute isLoggedIn={isLoggedIn}/>}>
                        <Route
                            path={ROUTES.customers }
                            element={<ViewCustomers/> }
                        />
                    </Route>
                    <Route path={ROUTES.vehicles} element={<ProtectedRoute isLoggedIn={isLoggedIn}/>}>
                        <Route
                            path={ROUTES.vehicles }
                            element={<ViewVehicles/> }
                        />
                    </Route>

                    <Route path={ROUTES.orders} element={<ProtectedRoute isLoggedIn={isLoggedIn}/>}>
                        <Route
                            path={ROUTES.orders }
                            element={<OrdersView/> }
                        />
                    </Route>

                    {
                        isAdmin &&
                        <Route path={ROUTES.users} element={<ProtectedRoute isLoggedIn={isLoggedIn}/>}>
                            {
                                <Route
                                    path={ROUTES.users }
                                    element={<UsersView/> }
                                />
                            }
                        </Route>
                    }

                    <Route path={ROUTES.home} element={<ProtectedRoute isLoggedIn={isLoggedIn}/>}>
                        <Route
                            path={ROUTES.home}
                            element={<Home/>}
                        />
                    </Route>
                </Route>
            
                <Route path={ROUTES.profile} element={<ProtectedRoute isLoggedIn={isLoggedIn}/>}>
                    <Route
                        path={ROUTES.profile}
                        element={<UserProfile />}
                    />
                </Route>


            <Route
                path={ROUTES.logout}
                element={<Logout setIsLoggedIn={setIsLoggedIn}/>}
            />

        </Routes>
    );
}