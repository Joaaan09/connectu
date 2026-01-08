import React from 'react'
import avatar from '../../../assets/img/user.png'
import { NavLink } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helpers/Global'

export const Nav = () => {
    const { auth, counters } = useAuth();

    const userImage =
        auth?.image && auth.image !== "default.png"
            ? Global.url + "user/avatar/" + auth.image
            : avatar;

    return (
        <nav className="navbar__container-lists">

            <ul className="container-lists__menu-list">
                <li className="menu-list__item">
                    <NavLink to="/" className="menu-list__link">
                        <i className="fa-solid fa-house"></i>
                        <span className="menu-list__title">Inicio</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to="feed" className="menu-list__link">
                        <i className="fa-solid fa-list"></i>
                        <span className="menu-list__title">Timeline</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to="people" className="menu-list__link">
                        <i className="fa-solid fa-user"></i>
                        <span className="menu-list__title">Gente</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <i className="fa-regular fa-envelope"></i>
                        <span className="menu-list__title">Mensajes</span>
                    </a>
                </li>
            </ul>

            <ul className="container-lists__list-end">
                <li className="list-end__item">
                   <NavLink to={"/social/perfil/" + auth?._id} className="list-end__link-image">
                        <img src={userImage} className="list-end__img" alt="Imagen de perfil" />
                    </NavLink>
                </li>

                <li className="list-end__item">
                    <NavLink to={"/social/perfil/" + auth?._id}  className="list-end__link">
                        <span className="list-end__name">{auth?.nick || "Cargando..."}</span>
                    </NavLink>
                </li>

                <li className="list-end__item">
                    <NavLink to="config" className="list-end__link">
                        <i className='fa-solid fa-gear'></i>
                        <span className="list-end__name">Ajustes</span>
                    </NavLink>
                </li>

                <li className="list-end__item">
                    <NavLink to="logout" className="list-end__link">
                        <i className='fa-solid fa-arrow-right-from-bracket'></i>
                        <span className="list-end__name">Cerrar sesión</span>
                    </NavLink>
                </li>
            </ul>

        </nav>
    )
}
