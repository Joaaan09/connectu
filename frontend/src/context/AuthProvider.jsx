import React, { createContext, useState, useEffect } from 'react';
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null); // auth null por defecto
    const [counters, setCounters] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carga inicial del usuario desde localStorage
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            if (!token || !user) {
                setLoading(false);
                setAuth(null);
                return;
            }

            const userObj = JSON.parse(user);
            const userId = userObj.id || userObj._id;

            try {
                // Petición para comprobar token y obtener datos completos del usuario
                const profileReq = await fetch(`${Global.url}user/profile/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });

                const profileData = await profileReq.json();

                // Petición para contadores
                const countersReq = await fetch(`${Global.url}user/counters/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });

                const countersData = await countersReq.json();

                // Actualiza estado
                setAuth(profileData.user);
                setCounters(countersData);
            } catch (error) {
                console.error('Error cargando usuario:', error);
                setAuth(null);
                setCounters({});
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Función para actualizar usuario en contexto y localStorage
    const updateAuth = (updatedUser) => {
        if (updatedUser === null) {
            localStorage.removeItem('user');
            setAuth(null);
            return;
        }
        setAuth(prev => {
            const newAuth = { ...prev, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newAuth));
            return newAuth;
        });
    };


    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth: updateAuth, // usar updateAuth para mantener localStorage sincronizado
                counters,
                setCounters,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
