/* eslint-disable no-unused-vars */
import React from 'react'
import avatar from '../../../assets/img/user.png'
import { NavLink } from 'react-router-dom'
export const Nav = () => {
  return (
    <nav className="navbar__container-lists">

    <ul className="container-lists__menu-list">
        <li className="menu-list__item">
            <NavLink to="/login" className="menu-list__link">
                <i className="fa-solid fa-user"></i>
                <span className="menu-list__title">Inicio</span>
            </NavLink>
        </li>

    

        <li className="menu-list__item">
            <NavLink to="/registro" className="menu-list__link">
                <i className="fa-solid fa-user"></i>
                <span className="menu-list__title">Registro</span>
            </NavLink>
        </li>

   
    </ul>



</nav>
  )
}
