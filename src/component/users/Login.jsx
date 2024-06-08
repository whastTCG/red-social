/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helper/Global";
import useAuth from "../../hooks/useAuth";

export const Login = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("notSender");

  const {setAuth} = useAuth();

  const login = async (e) => {
    e.preventDefault();

    //console.log(form);

    let userToLogin = form;
    //console.log(userToLogin);
    //peticion
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await request.json();

    console.log(data);

    if (data.status === "success") {
      
      //persistir los datos en el navegador
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.userLogin));
      setSaved("saved");

      // set datos en el auth
      setAuth(data.user);
      //redirigir
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    }
    if (data.status === "no existe") {
      setSaved("no existe");
    }

    if (data.status === "error password") {
      setSaved("error password");
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Login</h1>
        {/* <button className="content__button">Mostrar nuevas</button> */}
      </header>

      <div className="content__posts">
        <strong className="alert alert=success">
          {saved === "saved" ? "Ingresado correctamente" : ""}
        </strong>

        <strong className="alert alert-danger">
          {saved === "no existe"
            ? "mail no registrado, no existe el usuario"
            : ""}
        </strong>

        <strong>
          {saved === "error password" ? "password incorrecto" : ""}
        </strong>

        <form className="form=login" onSubmit={login}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="password">password</label>
            <input type="password" name="password" onChange={changed} />
          </div>

          <input
            type="submit"
            value="identificate"
            className="btn btn-success"
          />
        </form>
      </div>
    </>
  );
};
