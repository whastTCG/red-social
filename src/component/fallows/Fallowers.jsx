/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";

import { Subject, debounceTime } from "rxjs";
import axios from "axios";
import { Global } from "../../helper/Global";

import { UserList } from "../users/userList";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


// Crear un Subject para manejar eventos
let enviarFallowing = new Subject();
let enviarFallowing$ = enviarFallowing.asObservable();

export const Fallowers = () => {
  const [users, setUsers] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [moreAvailable, setMoreAvailable] = React.useState(true);
  const [fallowing, setFallowing] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const  { auth } = useAuth();
const params = useParams();

const userId = params.userId;

  // useEffect para suscribirse al observable y manejar los eventos
  useEffect(() => {
    const subscription = enviarFallowing$
      .pipe(debounceTime(200))
      .subscribe(async (event) => {
        if (event.type === "FETCH_USERS") {
          try {
            const request = await axios.get(
                Global.url + "fallow/list-user-fallowed?page=" + page,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token"),
                },
              }
            );
            
            if (request.data.status === "success" && request.data.fallowed) {
                let cleanUsers= []
                request.data.fallowed.forEach(element => {
                    cleanUsers = [...cleanUsers, element.user]
                });
              

                
              setUsers((prevUser) => [...prevUser, ...cleanUsers]);

              setFallowing(request.data.userFallowing);
              //paginacion
            }
            if (request.data.pages <= 1 || request.data.pages <= page) {
              setMoreAvailable(false);
            }
          } catch (error) {
            console.error("Error fetching users:", error);
          } finally {
            setCargando(false);
          }
        }
      });

    // Emitir un evento inicial para activar la suscripción
    enviarFallowing.next({ type: "FETCH_USERS" });
    // Limpiar la suscripción al desmontar el componente
    return () => {
      subscription.unsubscribe();
    };
  }, [page]);


if (cargando) {
    <p>Cargando...</p>
}
console.log(users)
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Usuarios que sigue {auth.name} {auth.surname}</h1>
      </header>
      <UserList users={users} setUsers={setUsers} fallowing={fallowing} setFallowing={setFallowing} cargando={cargando} setCargando={setCargando} page={page} setPage={setPage} moreAvailable={moreAvailable}/>
    </>
  );
};
