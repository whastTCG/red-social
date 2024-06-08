/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Global } from "../../helper/Global";
import avatar from "../../assets/img/user.png";
import { Subject, debounceTime } from "rxjs";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
// Crear un Subject para manejar eventos
let enviarUserList = new Subject();
let enviarUserList$ = enviarUserList.asObservable();

export const UserList = ({
  users,
  setUsers,
  fallowing,
  setFallowing,
  cargando,
  setCargando,
  page,
  setPage,
  moreAvailable,
}) => {
  const { auth, updateCounters } = useAuth();

  // Método para formatear la fecha
  function formatDate(date) {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convertir la cadena de fecha a un objeto Date
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript van de 0 a 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
    const nextPage = () => {
      let next = page + 1;
      setPage(next);
    };

  const fallow = (userId) => {
    enviarUserList.next({ type: "FALLOW", userId });
  };

  const unFallow = (userId) => {
    enviarUserList.next({ type: "UNFALLOW", userId });
  };


  

  //useEffect para la peticion unfallow
  useEffect(() => {
    const subscription  = enviarUserList$
      .pipe(debounceTime(1000))
      .subscribe(async (event) => {
        if (event.type === "UNFALLOW") {
          try {
            console.log("metodo unfallow");

            const request = await axios.delete(
              Global.url + "fallow/unfallow?unfallow=" + event.userId,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token"),
                },
              }
            );

            if (request.data.status === "success") {
              // Emitir un evento inicial para activar la suscripción
              setFallowing((prevFallowing) =>
                prevFallowing.filter(
                  (followingUserId) => event.userId !== followingUserId
                )
              );
              updateCounters(auth._id);
              console.log(request.data.message);
            }
          } catch (error) {
            console.log("Error al ejecutar la funcion unfallow" + error);
          } finally {
            setCargando(false);
          }
        }
        if (event.type === "FALLOW") {
          try {
            console.log("metodo de fallow");
            const request = await axios.post(
              Global.url + "fallow/fallow",
              {
                fallowed: event.userId,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token"),
                },
              }
            );
            //console.log("respuesta " + request.data.status);

            if (request.data.status === "success") {
              // Emitir un evento inicial para activar la suscripción

              setFallowing((prevFallowing) => [...prevFallowing, event.userId]);
              updateCounters(auth._id);
              console.log(request.data.message);
            }
          } catch (error) {
            console.error("Error al ejecutar la funcion Fallow " + error);
          } finally {
            setCargando(false);
          }
        }
      });
      return () => {
        subscription.unsubscribe();
    };
  }, [fallowing, setFallowing, setCargando]);

  return (
    <>
      <div className="content__posts">
        {console.log("cargando fallowing", fallowing)}

        {cargando ? "Cargando..." : ""}
        {users.map((user) => {
          return (
            <article className="posts__post" key={user._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link to={"/social/perfil/" + user._id} className="post__image-link">
                    {user.image !== "default.png" ? (
                      <img
                        src={Global.url + "user/avatar/" + user.image}
                        className="post__image-user"
                        alt="foto de perfil"
                      />
                    ) : (
                      <img
                        src={avatar}
                        className="post__image-user"
                        alt="foto de perfil"
                      />
                    )}
                  </Link>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                  <Link to={"/social/perfil/" + user._id} className="user-info__name">
                      {user.name} {user.surname}
                    </Link>
                    <span className="user-info__divider"> | </span>
                    <Link to={"/social/perfil/" + user._id} className="user-info__create-date">
                     <ReactTimeAgo date={user.created_at}/> 
                    </Link>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>
                </div>
              </div>

              <div className="post__buttons">
                {auth._id === user._id ? (
                  ""
                ) : fallowing.includes(user._id) ? (
                  <button
                    className="post__button "
                    onClick={() => unFallow(user._id)}
                  >
                    Dejar de Seguir
                  </button>
                ) : (
                  <button
                    className="post__button post__button--green"
                    onClick={() => fallow(user._id)}
                  >
                    Seguir
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="content__container-btn">
        {moreAvailable === true ? (
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver más personas
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
