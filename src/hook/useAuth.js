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
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userAccountRole, setUserAccountRole] = useState(null); // Stato per il ruolo account (admin/user)
  const [isRegisterView, setRegisterView] = useState(false);

  const handleLoginSuccess = (user) => {
    console.log("User data received from Login:", user);
    setLogged(true);
    // Salva lo username invece dell'email per la visualizzazione nella lista utenti
    if (typeof user === "object" && user !== null) {
      setCurrentUser(user.username || user.email || "Guest");
      setUserAccountRole(user.ruolo || "user");
    } else {
      setCurrentUser(typeof user === "string" ? user : "Guest");
      setUserAccountRole("user");
    }
    setRegisterView(false);
  };
  const handleLoginGuest = () => {
    console.log("User logged in as Guest");
    setIsGuest(true);
    setCurrentUser("Guest");
    setUserAccountRole(null); // Guest non ha ruolo
    setRegisterView(false);
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
      setUserAccountRole(null);
    }
  };

  return {
    isLogged,
    isGuest,
    isLoading,
    currentUser,
    userAccountRole,
    isRegisterView,
    setIsGuest,
    setLogged,
    setRegisterView,
    handleLoginSuccess,
    handleLoginGuest,
    handleLogout,
  };
};
