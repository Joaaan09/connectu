import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global';

export const Register = () => {

    const { form, changed } = useForm({});
    const [saved, setSaved] = useState("not_sended");

    const saveUser = async (e) => {
        // Prevenir actualización de pantalla
        e.preventDefault();

        // Recoger datos del formulario
        let newUser = form;

        // Guardar usuario en el backend
        const request = await fetch(Global.url + "user/register", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();

        if (data.status == "success") {
            setSaved("saved");
        } else {
            setSaved("error");
        }


    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Registro</h1>
            </header>

            <div className="content__posts">

                <strong className={`alert ${saved === "saved" ? "alert-success" : saved === "error" ? "alert-error" : ""}`}>
                    {saved === "saved"
                        ? "Usuario registrado correctamente"
                        : saved === "error"
                            ? "El usuario no se ha registrado"
                            : ""}
                </strong>


                <form className="register-form" onSubmit={saveUser}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name='name' onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="surname">Apellidos</label>
                        <input type="text" name='surname' onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nick">Nickname</label>
                        <input type="text" name='nick' onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input type="email" name='email' onChange={changed} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name='password' onChange={changed} />
                    </div>

                    <input type="submit" value="Regístrate" className='btn btn-success' />
                </form>

            </div>
        </>
    )
}
