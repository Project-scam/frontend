// src/components/Registration/Registration.jsx

import { useState } from "react";
import Message from "../Message";
import { API_URLS } from "../../config.js";

const Registration = ({
  inputName = "Username", // defaul cambiabile liv. visivo
  inputPassword = "Password", // defaut cambiabile liv. visivo
  inputPasswordReconfirm = "Rewrite Password", // default cambiabile liv. visivo
  onRegisterSuccess,
  onShowLogin,
}) => {
  const [messageError, setMessageError] = useState(null); // stato per messaggio errore

  const handleSubmit = async (event) => {
    event.preventDefault(); // qui blocco per inviare i dati nel formato json con fetch

    setMessageError(null); // vado così a cancellare possibili errori se c'è ne sono stati a una richiesta di registrazione precedente rimpostanto lo stato a null

    const username = event.target.elements.username.value; // prendo i valori dell' username
    const password = event.target.elements.password.value; // prendo i valori della password
    const rewritePassword = event.target.elements.passwordReconfirm.value; // prendo i valori della seconda password

    // CONTROLLO DATI INSERITI DALL'UTENTE
    if (username.includes(" ")) {
      return setMessageError("Non puoi lasciare spazi vuoti");
    }
    if (password !== rewritePassword) {
      // se le password non coincidono
      return setMessageError("Le password non coincidono!");
    }

    try {
      /* RICHIESTA AL SERVER TRAMITE FETCH */
      const response = await fetch(
        API_URLS.REGISTER,
        {
          method: "POST", // il metodo è post
          headers: { "Content-Type": "application/json" }, // gli dico quali dati sta ricevendo in questo caso json
          body: JSON.stringify({ username: username, password: password }), // inserico i dati che voglio spedirgli in json trasformati in stringa da stringify
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registrazione non riuscita");
      }

      onRegisterSuccess();
    } catch (error) {
      setMessageError(error.message);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="registration-card">
        <h1 className="title">REGISTRATION</h1>

        <form onSubmit={handleSubmit} className="registration-form">
          <label htmlFor="username">{inputName}:</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Write your username"
            required
          />

          <label htmlFor="password">{inputPassword}:</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Write your password"
            required
          />
          <br />
          <Message textColor="#d83924">{messageError}</Message>

          <label htmlFor="passwordReconfirm">{inputPasswordReconfirm}:</label>
          <input
            id="passwordReconfirm"
            name="passwordReconfirm"
            type="password"
            placeholder="Rewrite your password "
            required
          />

          <button
            type="submit"
            className="registration-btn"
          >
            CREATE ACCOUNT
          </button>
        </form>
        <button type="button" className="back-btn" onClick={onShowLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Registration;
