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
        <div className="test-credentials">
          <h3 className="test-credentials__title">
            <i className="fa-solid fa-circle-info"></i> Credenciales de Prueba
          </h3>
          <div className="test-credentials__list">
            <div className="test-credentials__item">
              <span className="test-credentials__label">Usuario:</span>
              <span
                className="test-credentials__value"
                onClick={(e) => {
                  navigator.clipboard.writeText("test@connectu.com");
                  const span = e.currentTarget;
                  const popup = document.createElement("span");
                  popup.className = "test-credentials__copied-popup";
                  popup.innerText = "¡Copiado!";
                  span.appendChild(popup);
                  setTimeout(() => popup.remove(), 1500);
                }}
              >
                test@connectu.com
              </span>
            </div>
            <div className="test-credentials__item">
              <span className="test-credentials__label">Contraseña:</span>
              <span
                className="test-credentials__value"
                onClick={(e) => {
                  navigator.clipboard.writeText("testPass");
                  const span = e.currentTarget;
                  const popup = document.createElement("span");
                  popup.className = "test-credentials__copied-popup";
                  popup.innerText = "¡Copiado!";
                  span.appendChild(popup);
                  setTimeout(() => popup.remove(), 1500);
                }}
              >
                testPass
              </span>
            </div>
          </div>
          <p className="test-credentials__copy-hint">Haz clic en los valores para copiarlos</p>
        </div>

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
            <p>Usuario prueba: test@connectu.com | Contraseña: testPass</p>
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
