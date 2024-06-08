import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";


import { Global } from "../../helper/Global";
import axios from "axios";

import { PublicationList } from "../publication/PublicationList";




export const Feed = () => {
 
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [publication, setPublication] = useState([]);
  const [moreAvailable, setMoreAvailable] = React.useState(false);
 

  const nextPage = () => {
    const next = page + 1;
    setPage(next);
    obtenerPublicaciones(next);
  };

  function formatDate(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const obtenerPublicaciones = async (page, showNews = false) => {
    try {
        if (showNews) {
            setPublication([]);
            setPage(1);
            
        }
      const request = await axios.get(
        Global.url + "publication/feed?page=" + page,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (request.data.status === "success" && showNews ===false ) {
        setPublication((prevPublicacion) => {
          const newPublications = request.data.publications.filter(
            (newPub) => !prevPublicacion.some((pub) => pub._id === newPub._id)
          );
          return [...prevPublicacion, ...newPublications];
        });

       

        if (request.data.pages <= 1 || request.data.pages <= page && showNews === false) {
          setMoreAvailable(false);
        } else {
          setMoreAvailable(true);
        }
      }

      if(showNews){
        console.log("probando")
        setPublication(request.data.publications);
      }
    } catch (error) {
      console.error("Error al tratar de obtener las publicaciones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPublication([]);
    setPage(1);
    setMoreAvailable(false);
   
  }, []);


  useEffect(()=>{

    obtenerPublicaciones(1);

  },[])


  if (loading) {
    <>Cargando...</>
  }
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button className="content__button" onClick={() => obtenerPublicaciones(1, true)}>Mostrar nuevas</button>
      </header>

      <PublicationList
        publication={publication}
        formatDate={formatDate}
        nextPage={nextPage}
        moreAvailable={moreAvailable}
        avatar={avatar}
      />
    </>
  );
};
