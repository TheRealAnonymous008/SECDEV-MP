import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from './components/Navbar';

export const WithNav = (props : {isAdmin : boolean}) => {
    return (
      <div>
        <Navbar isAdmin = {props.isAdmin}/>
        <Outlet/>
      </div>
    );
};