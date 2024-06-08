/* eslint-disable no-unused-vars */
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Header } from "./Header";
import { SideBar } from "./SideBar";
import useAuth from "../../../hooks/useAuth";

export const PrivateLayout = () => {
  const { auth, loading} = useAuth();

  if (loading) {
    return (
      <h1>Cargando...</h1>
    )
  }
 
  return (
    <>
      {/* {public layout} */}
      <Header />

      {/* {contenido rincipal} */}

      <section className="layout__content">
        {auth.id  || auth._id ?  <Outlet />  : <Navigate to='/login' />}
        
      </section>

      {/* {barra lateral} */}
      <SideBar />
    </>
  );
};
