//=====================================================
// File: useSocket.js
// Script per comunicazioni con Socket.io
// @autor: "catalin.groppo@allievi.itsdigitalacademy.com"
//         "mattia.zara@allievi.itsdigitalacademy.com"
//         "sandu.batrincea@allievi.itsdigitalacademy.com"
//         "andrea.villari@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2026-01-01"
//========================================================

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../config";

export const useSocket = (isLogged, currentUser) => {
  const [socket, setSocket] = useState(null);

  // Crea il socket solo quando si fa login, non quando currentUser cambia
  useEffect(() => {
    if (isLogged && !socket) {
      console.log("[useSocket] Creazione nuovo socket");
      const newSocket = io(API_BASE_URL);

      const registerUser = () => {
        // Estrai username se currentUser è un oggetto
        const username =
          typeof currentUser === "string" ? currentUser : currentUser?.username;

        if (username) {
          console.log("[useSocket] Registro utente:", username);
          newSocket.emit("register_user", username);
        }
      };

      newSocket.on("connect", () => {
        console.log("[useSocket] Socket connesso:", newSocket.id);
        registerUser();
      });

      // Se il socket è già connesso quando viene creato, registra subito l'utente
      if (newSocket.connected) {
        registerUser();
      }

      setSocket(newSocket);

      return () => {
        console.log("[useSocket] Chiusura socket (logout o unmount)");
        newSocket.close();
        setSocket(null); // Reset dello stato quando il socket viene chiuso
      };
    }

    // Se si fa logout, chiudi il socket
    if (!isLogged && socket) {
      console.log("[useSocket] Logout rilevato, chiudo socket");
      socket.close();
      setSocket(null);
    }
  }, [isLogged]); // Solo isLogged nelle dipendenze, NON currentUser

  // Se currentUser cambia dopo che il socket è già stato creato, ri-registra l'utente
  useEffect(() => {
    if (socket && socket.connected && currentUser) {
      // Estrai username se currentUser è un oggetto
      const username =
        typeof currentUser === "string" ? currentUser : currentUser?.username;

      if (username) {
        console.log("[useSocket] currentUser cambiato, ri-registro:", username);
        socket.emit("register_user", username);
      }
    }
  }, [socket, currentUser]);

  return socket;
};
