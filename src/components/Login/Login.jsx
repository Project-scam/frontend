import { useState } from "react";
import Input from "../Input.jsx";

export default function Login({ setRegisterValue, setLoginValue }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const risposta = await response.json();
    console.log(risposta);
  };

  return (
    <div className="page-login">
      <form className="form-login" onSubmit={handleSubmit}>
        <Input
          label={"Username"}
          value={email}
          setInputValue={(e) => {
            setEmail(e);
          }}
        />

        <Input
          label={"Password"}
          value={password}
          setInputValue={(e) => {
            setPassword(e);
          }}
        />

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
