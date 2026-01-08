//========================================================
// File: useAuth.js
// Script per l'autenticazione
// @author: "catalin.groppo@allievi.itsdigitalacademy.com"
//          "mattia.zara"@allievi.itsdigitalacademy.com"
//          "sandu.batrincea@allievi.itsdigitalacademy.com"
//          "andrea.villari"@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2026-01-01"
//=========================================================


import { useState, useEffect } from "react";
import { API_URLS } from "../config";

export const useAuth = () => {
  const [isLogged, setLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegisterView, setRegisterView] = useState(false);

  const handleLoginSuccess = (user) => {
    console.log("User data received from Login:", user)
    setLogged(true)
    setCurrentUser(typeof user === "string" ? user : user?.username || "Guest")
    setRegisterView(false)
  };

  // Verifica sessione al caricamento
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(API_URLS.VERIFY, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            handleLoginSuccess(data.user);
          }
        }
      } catch (error) {
        console.log("No active session or expired token");
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(API_URLS.LOGOUT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLogged(false);
      setCurrentUser(null);
    }
  };

  return {
    isLogged,
    isLoading,
    currentUser,
    isRegisterView,
    setRegisterView,
    handleLoginSuccess,
    handleLogout,
  };
};
