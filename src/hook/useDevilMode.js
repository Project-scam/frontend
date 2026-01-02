//========================================================
// File: useDevilMode.js
// Scripts per la gestione del gioco in modalità Devil
// @author: "cotalin.groppo@allievi.itsdigitalacademy.com"
//          "mattia.zara"@allievi.itsdigitalacademy.com"
//          "sandu.batrincea"@allievi.itsdigitalacademy.com"
//          "andrea.villari"@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2026-01-01"
//========================================================

import { useState, useEffect } from "react";
import { DEVIL_MODE_TIME } from "../utils/constants";

export const useDevilMode = (mode, gameWon, gameOver) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Inizializza timer quando entra in modalità Diavolo
  useEffect(() => {
    if (mode === "devil") {
      setTimeLeft(DEVIL_MODE_TIME);
      setHasStarted(false);
    }
  }, [mode]);

  // Timer countdown
  useEffect(() => {
    if (mode !== "devil") return;
    if (!hasStarted) return;
    if (gameWon || gameOver) return;

    if (timeLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameWon, gameOver, mode, hasStarted]);

  const startGame = () => {
    setHasStarted(true);
  };

  const getTimeExpired = () => {
    return timeLeft <= 0 && hasStarted;
  };

  return {
    timeLeft,
    hasStarted,
    startGame,
    getTimeExpired,
  };
};
