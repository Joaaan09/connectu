import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import useAuth from '../../../hooks/useAuth'

export const PrivateLayout = () => {

    const { auth, loading } = useAuth(null);

    if (loading) {
        return <h1>Cargando...</h1>
    } else {

        return (
            <>
                {/* LAYOUT */}
                <Header></Header>

                {/* CONTENIDO PRINCIPAL */}
                <section className="layout_content">
                    {auth?._id ?
                        <Outlet></Outlet>
                        :
                        <Navigate to="/login"></Navigate>
                    }
                </section>

                {/* BARRA LATERAL */}
                <Sidebar></Sidebar>

            </>
        )
    }
}
