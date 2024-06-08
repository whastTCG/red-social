// SideBar.js
import  { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { Global } from '../../../helper/Global';
import avatar from "../../../assets/img/user.png";
import { Link } from 'react-router-dom';
import { Subject, debounceTime } from 'rxjs';
import { useForm } from '../../../hooks/useForm';
import axios from 'axios';

let enviarPublication = new Subject();
let enviarPublication$ = enviarPublication.asObservable();

export const SideBar = () => {
  const { auth, counters, updateCounters, setCounters } = useAuth();
  const { form, changed } = useForm();
  const [stored, setStored] = useState("not_stored");

  const savePublication = (event) => {
    event.preventDefault();
    enviarPublication.next({ type: "publication" });
  }

  useEffect(() => {
    const subscription = enviarPublication$
      .pipe(debounceTime(1000))
      .subscribe(async (event) => {
        if (event.type === "publication") {
          try {
            let newPublication = form;
            const request = await axios.put(
              Global.url + "publication/save-publication",
              newPublication,
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            );

            if (request.data.status === "success") {
              setStored("stored");
              setCounters((prevCounter) => ({
                ...prevCounter,
                publications: prevCounter.publications +1,
              }))

              const fileInput = document.querySelector("#file");
              if (fileInput.files[0]) {
                const formData = new FormData();
                formData.append("file0", fileInput.files[0]);

                const request2 = await axios.post(
                  Global.url + "publication/upload-image?id=" + request.data.publication._id,
                  formData,
                  {
                    headers: {
                      Authorization: localStorage.getItem("token"),
                    },
                  }
                );

                if (request2.data.status === "success") {
                  
                  setStored("stored");
                  setCounters((prevCounter) => ({
                    ...prevCounter,
                    publications: prevCounter.publications  +1,
                  }))
                } else {
                  setStored("error");
                }
              }
            } else {
              setStored("error");
            }
          } catch (error) {
            setStored("error");
            console.error("error al intentar publicar tu mensaje" + error);
          } finally {
            const myForm = document.querySelector("#publication-form");
            myForm.reset();
          }
        }
      });

    return () => {
      subscription.unsubscribe();
    }
  }, [form, auth._id, updateCounters]);

  return (
    <>
      <aside className="layout__aside">
        <header className="aside__header">
          <h1 className="aside__title">Hola, {auth.name}</h1>
        </header>

        <div className="aside__container">
          <div className="aside__profile-info">
            <div className="profile-info__general-info">
              <div className="general-info__container-avatar">
                {auth.image !== 'default.png' ? (
                  <img src={Global.url + "user/avatar/" + auth.image} className='container-avatar__img' alt='foto de perfil' />
                ) : (
                  <img src={avatar} className='container-avatar__img' alt='foto de perfil' />
                )}
              </div>

              <div className="general-info__container-names">
                <Link to={"/social/perfil/" + auth._id} className="container-names__name">
                  {auth.name + " " + auth.surname}
                </Link>
                <p className="container-names__nickname">{auth.nick}</p>
              </div>
            </div>

            <div className="profile-info__stats">
              <div className="stats__following">
                <Link to={"/social/siguiendo/" + auth._id} className="following__link">
                  <span className="following__title">Siguiendo</span>
                  <span className="following__number">{counters.fallowing}</span>
                </Link>
              </div>
              <div className="stats__following">
                <Link to={"/social/seguidores/" + auth._id} className="following__link">
                  <span className="following__title">Seguidores</span>
                  <span className="following__number">{counters.fallowed}</span>
                </Link>
              </div>

              <div className="stats__following">
                <Link to={"/social/perfil/" + auth._id} className="following__link">
                  <span className="following__title">Publicaciones</span>
                  <span className="following__number">{counters.publications}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="aside__container-form">
            <strong className="alert alert-success">
              {stored === "stored" ? "Publicada Correctamente" : ""}
            </strong>
            <strong className="alert alert-danger">
              {stored === "error" ? "No se ha publicado nada" : ""}
            </strong>

            <form className="container-form__form-post" onSubmit={savePublication} id="publication-form">
              <div className="form-post__inputs">
                <label htmlFor="text" className="form-post__label">¿Qué estás pensando hoy?</label>
                <textarea name="text" className="form-post__textarea" onChange={changed}></textarea>
              </div>

              <div className="form-post__inputs">
                <label htmlFor="image" className="form-post__label">Sube tu foto</label>
                <input type="file" name="file0" id="file" className="form-post__image" />
              </div>

              <input type="submit" value="Enviar" className="form-post__btn-submit" />
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
