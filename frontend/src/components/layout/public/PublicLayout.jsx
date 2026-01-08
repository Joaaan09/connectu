import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Header } from './Header'
import useAuth from '../../../hooks/useAuth'

export const PublicLayout = () => {

    const { auth } = useAuth(null);

    return (
        <>
            {/* LAYOUT */}
            <Header></Header>

            {/* CONTENIDO PRINCIPAL */}
            <section className="layout_content">
                {!auth?._id ?
                    <Outlet></Outlet>
                    :
                    <Navigate to="/social"></Navigate>
                }
            </section>
        </>
    )
}
