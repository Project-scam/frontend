import { useState, useEffect } from "react";
import Input from "../Input.jsx";
import { API_URLS } from "../../config.js";
import Modal from "../Modal/Modal.jsx";

export default function ResetPassword({ onBackToLogin }) {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    textColor: "black",
    textColorSubtitle: "black"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Estrai token ed email dall'URL usando URLSearchParams nativi
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    const emailParam = urlParams.get("email");

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setModalConfig({
        title: "Invalid Link",
        message: "Missing reset token or email. Please request a new reset link.",
        textColor: "black",
        textColorSubtitle: "red"
      });
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalConfig.textColorSubtitle === "green") {
      // Se il reset è andato a buon fine, torna al login
      onBackToLogin();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setModalConfig({
        title: "Error",
        message: "Passwords do not match",
        textColor: "black",
        textColorSubtitle: "red"
      });
      setShowModal(true);
      return;
    }

    if (newPassword.length < 6) {
      setModalConfig({
        title: "Error",
        message: "Password must be at least 6 characters",
        textColor: "black",
        textColorSubtitle: "red"
      });
      setShowModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URLS.BASE}/password-reset/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setModalConfig({
          title: "Error",
          message: data.error || "Failed to reset password",
          textColor: "black",
          textColorSubtitle: "red"
        });
      } else {
        setModalConfig({
          title: "Success",
          message: "Password reset successfully! You can now login with your new password.",
          textColor: "black",
          textColorSubtitle: "green"
        });
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
        <h2>Reset Password</h2>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
          Enter your new password below.
        </p>

        <Input
          id={"NewPassword"}
          label={"New Password"}
          type="password"
          value={newPassword}
          setInputValue={setNewPassword}
          required
        />

        <Input
          id={"ConfirmPassword"}
          label={"Confirm Password"}
          type="password"
          value={confirmPassword}
          setInputValue={setConfirmPassword}
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

        <button type="submit" disabled={loading || !token || !email}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <button type="button" onClick={onBackToLogin}>
          Back to Login
        </button>
      </form>
    </div>
  );
}
