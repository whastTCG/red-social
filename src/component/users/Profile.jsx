/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/useAuth";
import { Link, useParams } from "react-router-dom";
import { getProfileUser } from "../../helper/GetProfile";
import { Global } from "../../helper/Global";
import axios from "axios";
import { Subject, debounceTime } from "rxjs";
import { deletePublication } from "../../helper/DeletePublication";
import { PublicationList } from "../publication/PublicationList";

let enviar = new Subject();
let enviar$ = enviar.asObservable();

export const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  // const [, ] = useState(0);
  const [iFollow, setIFollow] = useState(false);
  const { auth , updateCounters, counters, setCounters, setAuthPublication} = useAuth();
  const params = useParams();
  const [page, setPage] = useState(1);
  const [publication, setPublication] = useState([]);
  const [moreAvailable, setMoreAvailable] = React.useState(false);
  
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

  const metodoSeguir = (userId) => {
    enviar.next({ type: "fallow", userId });
  };

  //effect que ejecuta la funcion de seguir usuarios
  useEffect(() => {
    const subscription = enviar$
      .pipe(debounceTime(1000))
      .subscribe(async (event) => {
        if (event.type === "fallow") {
          try {
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

            if (request.data.status === "success") {
              setIFollow(true);
            }
          } catch (error) {
            console.error("error al ejecutar la funcion de seguir: ", error);
          }
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [iFollow]);

  const metodoDejarDeSeguir = (userId) => {
    enviar.next({ type: "unfallow", userId });
  };

  useEffect(() => {
    const subscription = enviar$
      .pipe(debounceTime(1000))
      .subscribe(async (event) => {
        if (event.type === "unfallow") {
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
              setIFollow(false);
              updateCounters(auth._id);
            }
          } catch (error) {
            console.log("Error al ejecutar la funcion unfallow" + error);
          }
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [iFollow]);

  useEffect(() => {
    const obtenerPerfil = async () => {
      const data = await getProfileUser(params.userId);
      setUser(data.userProfile);
      if (data.fallowing && data.fallowing._id) {
        setIFollow(true);
      }
      setLoading(false);
    };

    // const getCounter = async () => {
    //   try {
    //     const request = await axios.get(
    //       Global.url + "user/count/" + params.userId,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           //con authorization le pasamos el token y el backend comprueba si es el mismo
    //           Authorization: localStorage.getItem("token"),
    //         },
    //       }
    //     );
    //     if (request.data.status === "success") {
    //       setCounter(request.data);
          
          
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    obtenerPerfil();
    updateCounters(auth._id);
    // getCounter();
  }, [params, setIFollow, iFollow,setCounters, auth._id ]);

  const obtenerPublicaciones = () => {
    enviar.next({ type: "publicaciones", newProfile:true});
  };

  useEffect(()=>{
      // Resetear publicaciones y página cuando cambia el usuario
      setPublication([]);
      setPage(1);
      setMoreAvailable(false);
  },[params])
  
  useEffect(() => {
   
    const subscription = enviar$
      .pipe(debounceTime(100))
      .subscribe(async (event) => {
        if (event.type === "publicaciones") {
          try {
            const request = await axios.get(
              Global.url +
                "publication/list-publications?id=" +
                params.userId +
                "&page=" +
                page,
              {
                headers: {
                  "Content-Type": "application/json",
                  //con authorization le pasamos el token y el backend comprueba si es el mismo
                  Authorization: localStorage.getItem("token"),
                },
              }
            );
            if (request.data.status === "success") {
              updateCounters(auth._id);
              setPublication((prevPublicacion) => [
                ...prevPublicacion,
                ...request.data.publicaciones,
              ]);
              setAuthPublication((prevPublication) => [
                ...prevPublication,
                ...request.data.publicaciones
              ]);
            }
            if (request.data.pages <= 1 || request.data.pages <= page) {
              setMoreAvailable(false);
            }else{
              setMoreAvailable(true);
            }

           
            if (request.data.pages <= 1 || request.data.pages <= page) {
              setMoreAvailable(false);
            }
          } catch (error) {
            console.error(
              "error al tratar de obtener las publicaciones ",
              error
            );
          } finally {
            setLoading(false);
           
          }
        }
      });

    obtenerPublicaciones();

    return () => {
      subscription.unsubscribe();
      
    };
  }, [params, page]);

  const deletePublicationController =(id) => {
    enviar.next({type:"delete-publication", id})
  }

  //useEffect para borrar publicaciones
useEffect(() =>{
  const subscription = enviar$.pipe(debounceTime(1000)).subscribe(async(event) =>{

    if (event.type === "delete-publication") {
      const data  = await deletePublication(event.id);

      if (data.status === "success") {
        setPublication((prevPublication) => prevPublication.filter((pub) => pub._id !== event.id));
        updateCounters(auth._id)
      // Actualizar el contador de publicaciones
      setCounters((prevCounter) => ({
        ...prevCounter,
        publications: prevCounter.publications - 1,
      }));
    }
 
    }

  
    
  });

  return () => {
    subscription.unsubscribe();
  }
},[counters,setCounters, auth._id])
  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <header className="aside__profile-info">
        <div className="profile-info__general-info">
          <div className="general-info__container-avatar">
            {auth.image !== "default.png" ? (
              <img
                src={Global.url + "user/avatar/" + user.image}
                className="container-avatar__img"
                alt="foto de perfil"
              />
            ) : (
              <img
                src={avatar}
                className="post__image-user"
                alt="foto de perfil"
              />
            )}

            <div className="general-info__container-names">
              <Link
                to={"/social/perfil/" + user._id}
                className="container-names__name"
              >
                {user.name + " " + user.surname}
              </Link>
              <p className="container-names__nickname">{user.nick}</p>
            </div>
          </div>

          <div className="general-info__container-names">
            <p href="#" className="container-names__name">
              <h1>
                {user.name} {user.surname}
              </h1>
              {user._id === auth._id ? (
                ""
              ) : iFollow ? (
                <button
                  className="content__button post__button"
                  onClick={() => metodoDejarDeSeguir(user._id)}
                >
                  Dejar de seguir
                </button>
              ) : (
                <button
                  className="content__button content__button--rigth"
                  onClick={() => metodoSeguir(user._id)}
                >
                  Seguir
                </button>
              )}
            </p>
            <h2 className="container-names__nickname">{user.nick}</h2>
            <p>{user.bio}</p>
          </div>
        </div>

        <div className="profile-info__stats">
          <div className="stats__following">
            <Link
              to={"/social/siguiendo/" + user._id}
              className="following__link"
            >
              <span className="following__title">Siguiendo</span>
              <span className="following__number">{counters.fallowing}</span>
            </Link>
          </div>
          <div className="stats__following">
            <Link
              to={"/social/seguidores/" + user._id}
              className="following__link"
            >
              <span className="following__title">Seguidores</span>
              <span className="following__number">{counters.fallowed}</span>
            </Link>
          </div>

          <div className="stats__following">
            <Link to={"/social/perfil/" + user._id} className="following__link">
              <span className="following__title">Publicaciones</span>
              {!counters.publications ? (
                <span className="following__number">{0}</span>
              ) : (
                <span className="following__number">
                  {counters.publications}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <PublicationList  publication={publication} formatDate={formatDate}  deletePublicationController={deletePublicationController} auth={auth}  nextPage={nextPage} moreAvailable={moreAvailable} avatar={avatar}  />
      {/* <div className="content__posts">
        {publication.map((publicaciones) => {
          return (
            <article className="posts__post" key={publicaciones._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link
                    to={"/social/perfil/" + publicaciones.user._id}
                    className="post__image-link"
                  >
                    {publicaciones.user.image !== "default.png" ? (
                      <img
                        src={
                          Global.url + "user/avatar/" + publicaciones.user.image
                        }
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
                    <a href="#" className="user-info__name">
                      {publicaciones.user.name} {publicaciones.user.surname}
                    </a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">
                      {formatDate(publicaciones.create_at)}
                    </a>
                  </div>

                  <h4 className="post__content">{publicaciones.text}</h4>
                  {publicaciones.file ? <img src={Global.url + "publication/media/" + publicaciones.file}/> : ""} 
                </div>
              </div>
              {auth._id === publicaciones.user._id ? (
                <div className="post__buttons">
                  <button onClick={() => deletePublicationController(publicaciones._id)} className="post__button">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ) : (
                ""
              )}
            </article>
          );
        })}
      </div> */}

      {/* <div className="content__container-btn">
        {moreAvailable ? (
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas publicaciones
          </button>
        ) : (
          ""
        )}
      </div> */}
    </>
  );
};
