import { useState } from "react";
import Input from "../Input.jsx";

export default function Login() {
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

        <button type="submit">Login</button>
      </form>

      <a
        href="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.H88aKb7tUCF3XycKwqHjFgHaEK%3Fpid%3DApi&f=1&ipt=9494b8724a2c4334c745ca42d552037d591b5a6c5889b3ae0375cdabf29a6a19&ipo=images"
        className="menu-subtitle"
      >
        Accedi come Ospite
      </a>
    </div>
  );
}
