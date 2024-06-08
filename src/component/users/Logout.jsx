/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const Logout = () => {
  const { setAuth, setCounters } = useAuth();
  const navegar = useNavigate();

  useEffect(() => {
    //vaciar local storage
    localStorage.clear();
    //setear estados globales a vacios
    setAuth({});
    setCounters({});
    //navigat (redireccion al login)
    navegar("/login");
  },[]);

  return <h1>Cerrando Sesion...</h1>;
};
