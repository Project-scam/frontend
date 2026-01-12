import { useState } from "react";
import Input from "../Input.jsx";
import { API_URLS } from "../../config.js";
import Modal from "../Modal/Modal.jsx";

export default function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    textColor: "black",
    textColorSubtitle: "black"
  });
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URLS.BASE}/password-reset/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setModalConfig({
          title: "Error",
          message: data.error || "Failed to send reset email",
          textColor: "black",
          textColorSubtitle: "red"
        });
      } else {
        setModalConfig({
          title: "Email Sent",
          message: "If the email exists, a reset link has been sent. Please check your inbox.",
          textColor: "black",
          textColorSubtitle: "green"
        });
        setEmail(""); // Reset del campo
      }
      setShowModal(true);

    } catch (err) {
      console.error(err);
      setModalConfig({
        title: "Error",
        message: "Network error. Please try again.",
        textColor: "black",
        textColorSubtitle: "red"
      });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-login">
      <form className="form-login" onSubmit={handleSubmit}>
        <h2 style={{ color: "white" }}>Forgot Password</h2>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
          Enter your email and we'll send you a link to reset your password.
        </p>

        <Input
          id={"Email"}
          label={"Email"}
          type="email"
          value={email}
          setInputValue={setEmail}
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

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <button type="button" onClick={onBackToLogin}>
          Back to Login
        </button>
      </form>
    </div>
  );
}