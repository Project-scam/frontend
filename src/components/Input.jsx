import React from "react";

export default function Input({ id, label, value, setInputValue, type }) {
  return (
    <>
      <label htmlFor={id} className="menu-title">{label}</label>

      <input
        id= {id} // an id is needed otherwise it gives an error in code inspection because the label is not connected
        type={type}
        value={value}
        onChange={(e) => setInputValue(e.target.value)}
        required
        className="login-input"
      />
    </>
  );
}
