import { useState } from "react";
import Input from "../Input.jsx";

export default function Login({ setRegisterValue, setLoginValue }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Resetta gli errori precedenti

    try {
      const response = await fetch(
        "https://backend-snowy-mu-43.vercel.app/login",
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

      console.log("Login riuscito:", risposta);
      // Qui potresti salvare il token utente e reindirizzare l'utente
    } catch (err) {
      // Cattura errori di rete o quelli lanciati sopra
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
          setInputValue={(e) => {
            setUsername(e);
          }}
        />

        <Input
          label={"Password"}
          value={password}
          setInputValue={(e) => {
            setPassword(e);
          }}
        />

        {error && <p className="error-message">{error}</p>}

        <button
          onClick={(e) => {
            setLoginValue(!e);
          }}
        >
          Login
        </button>

        <button
          onClick={(e) => {
            setRegisterValue(!e);
          }}
        >
          Registrati
        </button>

        <button
          onClick={(e) => {
            setLoginValue(!e);
          }}
        >
          Accedi come Ospite
        </button>
      </form>
    </div>
  );
}
