/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from "react";
import { Global } from "../helper/Global";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [counters, setCounters] = useState({});
  const [loading, setLoading] = useState(true);
  const [authPublication, setAuthPublication] = useState([]);

  useEffect(() => {
    const authUser = async () => {
      //sacar datos del usuario identificado del local storage
      const token = localStorage.getItem("token");

      const user = localStorage.getItem("user");

      //comprobar si tengo el token y el user
      if (!token || !user) {
        setLoading(false);
        return false;
      }
      //transformar los datos a un objeto de java script
      const userObj = JSON.parse(user);
      // console.log(userObj);
      const userId = userObj.id;
      //peticion ajax al back que compruebe el token
      // que me devuelva todos los datos del usuario
      const request = await fetch(Global.url + "user/profile/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //con authorization le pasamos el token y el backend comprueba si es el mismo
          Authorization: token,
        },
      });

      const data = await request.json();

      // peticion para traer los contadores
      const requestCounters = await fetch(Global.url + "user/count/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const dataCounters = await requestCounters.json();

      //console.log(data);
      //setear el estado de auth
      setAuth(data.userProfile);
      setCounters(dataCounters);
      setLoading(false);
    };

    authUser();
  }, []);

  const updateCounters = async (userId) => {
    const token = localStorage.getItem("token");

    const requestCounters = await fetch(Global.url + "user/count/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const dataCounters = await requestCounters.json();

    setCounters(dataCounters);

  };

  if (loading === true) {
    <p>Cargando...</p>;
  }
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        counters,
        setCounters,
        updateCounters,
        loading,
        authPublication,
        setAuthPublication
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
