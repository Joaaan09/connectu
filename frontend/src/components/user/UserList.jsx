import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import ReactTimeAgo from "react-time-ago"


export const UserList = ({ users, getUsers, following, setFollowing, loading, more, page, setPage }) => {
    const { auth } = useAuth();

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getUsers(next);
    }

    const follow = async (userId) => {
        // Petición al backend para guardar el follow
        const request = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json();

        // Cuando esté todo correcto
        if (data.status === "success") {
            // Actualizar estado de following, agregar en nuevo follow
            setFollowing([...following, userId]);

        }


    }

    const unfollow = async (userId) => {
        // Petición al backend para borrar el follow
        const request = await fetch(Global.url + "follow/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        // Cuando esté todo correcto
        if (data.status === "success") {

            // Actualizar estado de following, filtrando los datos para eliminar el antiguo userId que acabo de dejar de seguir
            let filterFollowings = following.filter(followingUserId => userId !== followingUserId);
            setFollowing(filterFollowings)
        }

    }


    return (
        <>
            <div className="content__posts">

                {users.map(user => {
                    return (
                        <article className="posts__post" key={user._id}>

                            <div className="post__container">

                                <div className="post__image-user">
                                    <a href="#" className="post__image-link">
                                        {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                                        {user.image == "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                    </a>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <Link to={"/social/perfil/" + user._id} className="user-info__name">{user.nick}</Link>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date"><ReactTimeAgo date={user.create_at} locale='es-ES'></ReactTimeAgo></a>
                                    </div>

                                    <h4 className="post__content">{user.bio}</h4>

                                </div>

                            </div>

                            {user._id != auth._id &&
                                <div className="post__buttons">

                                    {!following.includes(user._id) &&
                                        <a className="content__button button__profile " onClick={() => follow(user._id)}>
                                            Seguir
                                        </a>
                                    }

                                    {following.includes(user._id) &&
                                        <a className="content__button button__profile profile__unfollow " onClick={() => unfollow(user._id)}>
                                            Dejar de seguir
                                        </a>
                                    }

                                </div>
                            }
                        </article>

                    )
                })}


            </div>

            {loading ? "Cargando..." : ""}
            {more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver más personas
                    </button>
                </div>
            }
        </>
    )
}
