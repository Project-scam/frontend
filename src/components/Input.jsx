import React from "react";

export default function Input({ label, value, setInputValue, type }) {
  return (
    <>
      <label className="menu-title">{label}</label>

      <br />

      <input
        type={type}
        value={value}
        onChange={(e) => setInputValue(e.target.value)}
        required
        className="login-input"
      />
    </>
  );
}
