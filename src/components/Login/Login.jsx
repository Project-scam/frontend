import { useState } from "react"
import Input from "../Input.jsx"
import { API_URLS } from "../../config.js"
import Modal from "../Modal/Modal.jsx"

/**
 * Validates if a string is a valid email format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if valid email format, false otherwise.
 */
const isValidEmail = (email) => {
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

export default function Login({ onLoginSuccess, onShowRegister, onGuestLogin, onForgotPassword }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalConfig, setModalConfig] = useState({ // stato per mostrare la modal con il messaggio
    title: "",
    message: "",
    textColor: "black",
    textColorSubtitle: "black"
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setModalConfig({
      title: "",
      message: "",
      textColor: "black",
      textColorSubtitle: "black"
    }) // pulisco l'errore quando esco/chiudo dalla modal
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalConfig({ // resetto i messaggi
      title: "",
      message: "",
      textColor: "black",
      textColorSubtitle: "black"
    })
    setShowModal(false); // prima di fare la richiesta, chiudo la modal

    // Validate that username is a valid email
    if (!isValidEmail(username)) {
      setModalConfig({
        title: "Error login",
        message: "Please enter a valid email address",
        textColor: "black",
        textColorSubtitle: "red"
      })
      setShowModal(true)
      return
    }

    try {
      const response = await fetch(
        API_URLS.LOGIN,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // FONDAMENTALE: Permette al browser di salvare il cookie
          body: JSON.stringify({
            username, // Invia 'username' come richiesto dal backend
            password,
          }),
        }
      );

      const risposta = await response.json();

      if (!response.ok) {
        // Se la risposta non è OK (es. 401, 404, 500), lancia un errore con il messaggio del backend
        const messageError = risposta.error || "Error logging in"
        setModalConfig({
          title: "Error login",
          message: messageError,
          textColor: "black",
          textColorSubtitle: "red"
        })
        setShowModal(true)
        return

      }

      // Il token è ora gestito automaticamente dal browser tramite cookie HttpOnly
      // Non è necessario (e non è possibile) salvarlo manualmente
      onLoginSuccess(risposta.user); // Comunica il successo al componente App passando i dati utente

    } catch (err) {

      console.error(err.message);
      setModalConfig({
        title: "Error login",
        message: err.message,
        textColor: "black",
        textColorSubtitle: "red"
      })
      setShowModal(true);
      return

    }
  };


  return (
    <div className="page-login">
      <form className="form-login" onSubmit={handleSubmit}>
        <Input
          id={"Email"} // aggiunto id per la label
          label={"Email"}
          type="email"
          value={username}
          setInputValue={setUsername}
        />

        <Input
          id={"Password"} // aggiunto id per la label
          label={"Password"}
          type="password"
          value={password}
          setInputValue={setPassword}
        />

        {showModal && (
          <Modal
            title={modalConfig.title}
            subtitle={modalConfig.message}
            textColor={modalConfig.textColor}
            textColorSubtitle={modalConfig.textColorSubtitle}
            onClose={handleCloseModal} />
        )}

        <button type="submit">
          Login
        </button>

        <button
          type="button"
          onClick={onShowRegister}
        >
          Register
        </button>

        <button
          type="button"
          onClick={onGuestLogin}
        >
          Login as Guest
        </button>
        <button type="button" onClick={onForgotPassword}>Forgot Password</button>
      </form>
    </div>
  );
}
