/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helper/Global";
import avatar from "../../assets/img/user.png";
import { Subject, debounceTime } from "rxjs";
import { SerializeForm } from "../../helper/SerializarForm";
import axios from "axios";

let enviar = new Subject();
let enviar$ = enviar.asObservable();

export const Config = () => {
  const { auth, setAuth } = useAuth();
  const [saved, setSaved] = useState("not_saved");

  const updateUser = (event) => {
    event.preventDefault();
    enviar.next(event);
  };

  useEffect(() => {
    const subcription = enviar$
      .pipe(debounceTime(1000))
      .subscribe(async (event) => {
        // recoger los datos del formulario
        let newDataUser = SerializeForm(event.target);
        //borramos el file0 porque  no lo usaremos
        delete newDataUser.file0;

        //actualizar en la base de datos usaremos axios en este caso
        try {
          const request = await axios.put(
            Global.url + "user/update",
            newDataUser,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
              },
            }
          );

          if (request.data.status === "success" && request.data.userUpdate) {
            delete request.data.userUpdate.password;
            setAuth(request.data.userUpdate);
            setSaved("saved");
          } else {
            setSaved("error");
          }

          //subida de imagenes

          //seleccionamos el campo donde se sube la imagen con query selector que selecciona ese campo especifico por id
          const fileInput = document.querySelector("#file");

          if (request.data.status === "success" && fileInput.files[0]) {
            // recoger imagen a subir
            const formData = new FormData();
            formData.append("file0", fileInput.files[0]);

            //peticion para subir imagen

            const uploadRequest = await axios.post(
              Global.url + "user/upload-image",
              formData,
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            );

            if (uploadRequest.data.status === "success" && uploadRequest.data.userUpdate ) {
              setAuth(uploadRequest.data.userUpdate);
              setSaved("saved");
              
            }
          }
        } catch (error) {
          console.error("Error al actualizar usuario: ", error);
        }
      });
    return () => {
      return subcription.unsubscribe();
    };
  }, [saved, setAuth]);

  // Agrega este efecto adicional para manejar los cambios en auth
  useEffect(() => {
    if (auth) {
      console.log("Datos actualizados del usuario:", auth);
    }
  }, [auth]);

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Ajustes</h1>
        {/* <button className="content__button">Mostrar nuevas</button> */}
      </header>

      <div className="content__posts">
        <strong className="alert alert=success">
          {saved === "saved" ? "usuario actualizado correctamente" : ""}
        </strong>
        <strong className="alert alert-danger">
          {saved === "error"
            ? "error  al actualizar debe llenar todos los campos"
            : ""}
        </strong>
        <strong>
          {saved === "existe" ? "nick o correo ya estan en uso" : ""}
        </strong>
        <form className="config-form" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" name="name" defaultValue={auth.name} />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Apellidos</label>
            <input type="text" name="surname" defaultValue={auth.surname} />
          </div>

          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            <input type="text" name="nick" defaultValue={auth.nick} />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea name="bio" defaultValue={auth.bio} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" defaultValue={auth.email} />
          </div>

          <div className="form-group">
            <label htmlFor="password">password</label>
            <input type="password" name="password" />
          </div>
          <div className="form-group">
            <label htmlFor="file0">avatar</label>
            <div className="general-info__container-avatar">
              {auth.image !== "default.png" ? (
                <img
                  src={Global.url + "user/avatar/" + auth.image}
                  className="list-end__img"
                />
              ) : (
                <img
                  src={avatar}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
            </div>
            <input type="file" name="file" id="file" />
          </div>
          <br />
          <input type="submit" value="Register" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};
