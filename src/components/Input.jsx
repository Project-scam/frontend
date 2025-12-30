import React from "react";

export default function Input({ id, label, value, setInputValue, type }) {
  return (
    <>
      <label htmlFor={id} className="menu-title">{label}</label>

      <input
        id= {id} // serve un id se no da errore in ispeziona codice perchè la label non è collegata
        type={type}
        value={value}
        onChange={(e) => setInputValue(e.target.value)}
        required
        className="login-input"
      />
    </>
  );
}
