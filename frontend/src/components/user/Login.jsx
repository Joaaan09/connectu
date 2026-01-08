import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const Login = () => {

  const { form, changed } = useForm({});
  const [login, setLogin] = useState("not_sended");
  const { setAuth } = useAuth(null);

  const loginUser = async (e) => {
    e.preventDefault();

    // Datos del formulario
    let userToLogin = form;

    // Petición al backend 
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await request.json();

    // Persisitir los datos en el navegador
    if (data.status == "succes") {

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.userLogin));

      setLogin("login");

      // Redirección
      setTimeout(() => {

        // // Set datos en el auth
        setAuth(data.userLogin);
        window.location.reload();
      }, 1000)


    } else {
      setLogin("error")
    }
  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Login</h1>
      </header>

      <div className="content__posts">

        {login && (
          <strong
            className={`alert ${login === "login"
              ? "alert-success"
              : login === "error"
                ? "alert-error"
                : ""
              }`}
          >
            {login === "login"
              ? "Usuario logueado correctamente"
              : login === "error"
                ? "El usuario o contraseña no son correctos"
                : ""}
          </strong>
        )}
        <form className="login-form" onSubmit={loginUser}>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" name='email' onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" name='password' onChange={changed} />
          </div>

          <input type="submit" value="Identifícate" className='btn btn-success' />
        </form>


      </div>
    </>
  )
}
