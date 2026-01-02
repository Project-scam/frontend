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

      newSocket.on("connect", () => {
        console.log("Socket connesso:", newSocket.id);
        if (currentUser) {
          newSocket.emit("register_user", currentUser);
        }
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [isLogged, currentUser]);

  return socket;
};
