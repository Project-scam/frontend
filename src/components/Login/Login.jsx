import { useState } from "react";
import Input from "../Input.jsx";
import { API_URLS } from "../../config.js";


export default function Login({ onLoginSuccess, onShowRegister, onGuestLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        API_URLS.LOGIN,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username, // Invia 'username' come richiesto dal backend
            password,
          }),
        }
      );

      const risposta = await response.json();

      if (!response.ok) {
        // Se la risposta non è OK (es. 401, 404, 500), lancia un errore con il messaggio del backend
        throw new Error(risposta.error || "Errore durante il login");
      }

      // Salva il token ricevuto nel localStorage per le richieste future
      localStorage.setItem("token", risposta.token);

      onLoginSuccess(risposta.user); // Comunica il successo al componente App passando i dati utente
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="page-login">
      <form className="form-login" onSubmit={handleSubmit}>
        <Input
          label={"Username"}
          value={username}
          setInputValue={setUsername}
        />

        <Input
          label={"Password"}
          type="password"
          value={password}
          setInputValue={setPassword}
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit">
          Login
        </button>

        <button
          type="button"
          onClick={onShowRegister}
        >
          Registrati
        </button>

        <button
          type="button"
          onClick={onGuestLogin}
        >
          Accedi come Ospite
        </button>
      </form>
    </div>
  );
}
