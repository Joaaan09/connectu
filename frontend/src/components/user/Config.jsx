import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';
import avatar from '../../assets/img/user.png'

export const Config = () => {

    const { auth, setAuth } = useAuth();
    const [saved, setSaved] = useState("not_saved");

    const updateUser = async (e) => {
        e.preventDefault();

        // Recoger datos del formuario
        let newDataUser = SerializeForm(e.target);

        // Borrar propiedad innecesaria
        delete newDataUser.file0;

        // Actualizar usuario en la bd
        const request = await fetch(Global.url + "user/update", {
            method: "PUT",
            body: JSON.stringify(newDataUser),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();

        if (data.status === "success") {
            // Combinar los datos antiguos con los nuevos
            const updatedUser = { ...auth, ...data.userUpdated };
            delete updatedUser.password;
            // Set datos en el auth
            setAuth(updatedUser);

            setSaved("saved");


        } else {
            setSaved("error");
        }

        // Subida de imagenes
        const fileInput = document.querySelector("#file");

        if (data.status == "success" && fileInput.files[0]) {

            // Recoger imagen a subir
            const formData = new FormData();
            formData.append('file0', fileInput.files[0]);

            // Petición para enviar el fichero
            const uploadRequest = await fetch(Global.url + "user/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });

            const uploadData = await uploadRequest.json();

            if (uploadData.status == "succes") {
                const updatedUser = { ...auth, ...data.userUpdated };
                delete updatedUser.password;

                setAuth(uploadData.userUpdated)
                setSaved("saved");
            } else {
                setSaved("error")
            }
        }

    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Ajustes</h1>
            </header>

            <div className="content__posts">

                <strong className={`alert ${saved === "saved" ? "alert-success" : saved === "error" ? "alert-error" : ""}`}>
                    {saved === "saved"
                        ? "Usuario actualizado correctamente"
                        : saved === "error"
                            ? "El usuario no se ha actualizado"
                            : ""}
                </strong>


                <form className="register-form" onSubmit={updateUser} >
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name='name' defaultValue={auth.name} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="surname">Apellidos</label>
                        <input type="text" name='surname' defaultValue={auth.surname} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nick">Nickname</label>
                        <input type="text" name='nick' defaultValue={auth.nick} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea name='bio' defaultValue={auth.bio} className="form-post__textarea" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input type="email" name='email' defaultValue={auth.email} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name='password' />
                    </div>

                    <div className="form-group">
                        <label htmlFor="file0">Avatar</label>
                        <div className="avatar">
                            {/* MOSTRAR IMAGEN */}
                            <div className="general-info__container-avatar">
                                {auth.image != "default.png" && <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                                {auth.image == "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                            </div>
                            <br />
                        </div>
                        <input type="file" name="file0" id="file" className="form-post__image" />
                    </div>

                    <input type="submit" value="Guardar" className='btn btn-success' />
                </form>
            </div>
        </>
    )
}
