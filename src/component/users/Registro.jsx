/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../../../15-proyecto3-blog/src/helper/Global";

export const Registro = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("notSender");

  const SaveUser = async (e) => {
    //prevenir actualizar la pagina al hacer click en guardar
    e.preventDefault();
    //creamos el usuario para guardarlo en la base de datos
    //. con el helper o el hook useForm podemos recolectar todos los datos del formulario, guardarlos en un objeto llamado form para luego esos datos pasarselos a la variable newUser
    let newUser = form;

    //guaardar usuario en backend

    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await request.json();

    //console.log(data);
    //mandar un mensaje para saber si se registro

    if (data.status === "success") {
      setSaved("saved");
    } else {
      if (data.status ==="ya existe") {
        setSaved("existe");
      }else{
        setSaved("error")
      }
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Registro</h1>
        {/* <button className="content__button">Mostrar nuevas</button> */}
      </header>

      <div className="content__posts">
        <strong className="alert alert=success">{saved === "saved" ?  "usuario registrado correctamente" : ""}</strong>
        <strong className="alert alert-danger">{saved === "error" ?  "error  al registrar debe llenar todos los campos" : ""}</strong>
        <strong>{saved === "existe" ?  "nick o correo ya estan en uso" : ""}</strong>
        <form className="register-form" onSubmit={SaveUser}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" name="name" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Apellidos</label>
            <input type="text" name="surname" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            <input type="text" name="nick" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="password">password</label>
            <input type="password" name="password" onChange={changed} />
          </div>

          <input type="submit" value="Register" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};
