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

  useEffect(() => {
    if (isLogged && !socket) {
      const newSocket = io(API_BASE_URL);

      const registerUser = () => {
        if (currentUser) {
          console.log("[useSocket] Registro utente:", currentUser);
          newSocket.emit("register_user", currentUser);
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
        console.log("[useSocket] Chiusura socket");
        newSocket.close();
      };
    }
  }, [isLogged, currentUser]);

  // Se currentUser cambia dopo che il socket è già stato creato, ri-registra l'utente
  useEffect(() => {
    if (socket && socket.connected && currentUser) {
      console.log(
        "[useSocket] currentUser cambiato, ri-registro:",
        currentUser
      );
      socket.emit("register_user", currentUser);
    }
  }, [socket, currentUser]);

  return socket;
};
