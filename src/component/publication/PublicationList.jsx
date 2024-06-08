/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from 'react-router-dom';
import { Global } from '../../helper/Global';
import useAuth from '../../hooks/useAuth';
import ReactTimeAgo from 'react-time-ago';

export const PublicationList = ({publication,formatDate, deletePublicationController, nextPage,moreAvailable,avatar }) => {
  const {auth} = useAuth();
  return (
    <>
    <div className="content__posts">
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
                  <ReactTimeAgo date={publicaciones.create_at}/> 
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
  </div>
        <div className="content__container-btn">
        {moreAvailable ? (
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas publicaciones
          </button>
        ) : (
          ""
        )}
      </div>
</>
  )
}
