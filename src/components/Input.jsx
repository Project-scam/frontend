import React from "react";

export default function Input({ label, value, setValue, type }) {
  return (
    <>
      <label className="menu-title">{label}</label>

      <br />

      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className="login-input"
      />
    </>
  );
}
