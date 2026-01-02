//======================================================
// File: useGameMode.js
// Script per la gestione della modalità di gioco
// @authors: "catalin.groppo@allievi.itsdigitalacademy.com"
//           "mattia.zara@allievi.itsdigitalacademy.com"
//           "sandu.batrincea@allievi.itsdigitalacademy.com"
//           "villari.andrea@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2026-01-01"
//=========================================================
import { useState, useEffect } from "react";
import { generateRandomCode } from "../utils/gameUtils";
import { COLORS_BOMB, GAME_MODES } from "../utils/constants";

export const useGameMode = () => {
  const [mode, setMode] = useState(null);
  const [secretCode, setSecretCode] = useState([]);
  const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    if (!mode) {
      setSecretCode([]);
      return;
    }

    if (mode === GAME_MODES.VERSUS) {
      // In 1vs1 il codice viene gestito da useVersusMode
      setSecretCode([]);
    } else {
      // Normal / Devil → codice random
      setSecretCode(generateRandomCode(COLORS_BOMB));
    }
  }, [mode]);

  const resetGame = () => {
    setMode(null);
    setSecretCode([]);
    setSelectedColor(0);
  };

  return {
    mode,
    setMode,
    secretCode,
    setSecretCode,
    selectedColor,
    setSelectedColor,
    resetGame,
  };
};
