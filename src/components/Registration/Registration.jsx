// src/components/Registration/Registration.jsx

import { useEffect, useState } from "react";
import Modal from "../Modal/Modal.jsx";
import { API_URLS } from "../../config.js";

/**
 * Validates if a string is a valid email format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if valid email format, false otherwise.
 */
const isValidEmail = (email) => {
  // RFC 5322 compliant email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

const Registration = ({
  inputName = "Email", // defaul cambiabile liv. visivo
  inputPassword = "Password", // defaut cambiabile liv. visivo
  inputPasswordReconfirm = "Rewrite Password", // default cambiabile liv. visivo
  onRegisterSuccess,
  onShowLogin,
}) => {
  const [showModal, setShowModal] = useState(false); // stato per messaggio errore
  const [modalConfig, setModalConfig] = useState({
    // stato per mostrare la modal
    title: "",
    message: "",
    textColor: "black",
    textColorSubtitle: "black",
  });

  // FUNZIONE PER CHIUDERE LA MODAL
  const handleCloseModal = () => {
    setShowModal(false);

    setModalConfig({
      // resettare i messaggi
      title: "",
      message: "",
      textColor: "black",
      textColorSubtitle: "black",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // qui blocco per inviare i dati nel formato json con fetch

    setModalConfig({
      // resettare i messaggi
      title: "",
      message: "",
      textColor: "black",
      textColorSubtitle: "black",
    });

    setShowModal(false); // prima di fare la richiesta, chiudo la modal
<<<<<<< HEAD
    const email = event.target.elements.email.value; // prendo i valori dell' email
=======
    const username = event.target.elements.username.value; // prendo i valori dell' username
    const email = event.target.elements.email.value; // prendo i valori dell' username
>>>>>>> bd87167485fef5f8e779ccca47092a464818f2b7
    const password = event.target.elements.password.value; // prendo i valori della password
    const rewritePassword = event.target.elements.passwordReconfirm.value; // prendo i valori della seconda password

    // CONTROLLO DATI INSERITI DALL'UTENTE
    if (email.includes(" ")) {
<<<<<<< HEAD

=======
>>>>>>> bd87167485fef5f8e779ccca47092a464818f2b7
      setModalConfig({
        title: "Attention!",
        message: "You can't leave blank spaces",
        textColor: "red",
        textColorSubtitle: "black",
      });
      setShowModal(true);
      return;
    }

    // Validate that email is a valid email
    if (!isValidEmail(email)) {
      setModalConfig({
        title: "Attention!",
        message: "Please enter a valid email address",
        textColor: "red",
        textColorSubtitle: "black",
      });
      setShowModal(true);
      return;
    }

    if (password !== rewritePassword) {
      // se le password non coincidono
      setModalConfig({
        title: "Attention!",
        message: "The passwords don't match!",
        textColor: "red",
        textColorSubtitle: "black",
      });
      setShowModal(true);
      return;
    }

    try {
      /* RICHIESTA AL SERVER TRAMITE FETCH */
<<<<<<< HEAD
      const response = await fetch(
        API_URLS.REGISTER,
        {
          method: "POST", // il metodo è post
          headers: { "Content-Type": "application/json" }, // gli dico quali dati sta ricevendo in questo caso json
          body: JSON.stringify({ username: username, email: email, password: password }), // inserico i dati che voglio spedirgli in json trasformati in stringa da stringify
        }
      );
=======
      const response = await fetch(API_URLS.REGISTER, {
        method: "POST", // il metodo è post
        headers: { "Content-Type": "application/json" }, // gli dico quali dati sta ricevendo in questo caso json
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }), // inserico i dati che voglio spedirgli in json trasformati in stringa da stringify
      });
>>>>>>> bd87167485fef5f8e779ccca47092a464818f2b7

      const data = await response.json();

      if (!response.ok) {
        const messageError = data.error || "Registration failed";
        setModalConfig({
          title: "Attention!",
          message: messageError,
          textColor: "red",
          textColorSubtitle: "black",
        });
        setShowModal(true);
        return;
      } else {
        setModalConfig({
          title: "Success!",
          message: "Account created! Now login with your credentials.",
          textColor: "green",
          textColorSubtitle: "black",
        });
        setShowModal(true);

        setTimeout(() => {
          if (onShowLogin) onShowLogin(); // setRegisterView is false in app
        }, 2000);
      }
    } catch (error) {
      setModalConfig({
        title: "Attention!",
        message: error.message,
        textColor: "red",
        textColorSubtitle: "black",
      });
      setShowModal(true);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="registration-card">
        <h1 className="title">REGISTRATION</h1>

        <form onSubmit={handleSubmit} className="registration-form">
          <label htmlFor="email">{inputName}:</label>
          <input
<<<<<<< HEAD
=======
            id="username"
            name="username"
            type="text"
            placeholder="Write your username"
            required
          />
          <input
>>>>>>> bd87167485fef5f8e779ccca47092a464818f2b7
            id="email"
            name="email"
            type="email"
            placeholder="Write your email address"
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

          <label htmlFor="passwordReconfirm">{inputPasswordReconfirm}:</label>
          <input
            id="passwordReconfirm"
            name="passwordReconfirm"
            type="password"
            placeholder="Rewrite your password "
            required
          />

          {showModal && (
            <Modal
              title={modalConfig.title}
              subtitle={modalConfig.message}
              textColor={modalConfig.textColor}
              textColorSubtitle={modalConfig.textColorSubtitle}
              onClose={handleCloseModal}
            />
          )}

          <button type="submit" className="registration-btn">
            CREATE ACCOUNT
          </button>
        </form>

        <button type="button" className="back-menu-btn" onClick={onShowLogin}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default Registration;
