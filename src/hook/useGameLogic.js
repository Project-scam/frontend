//=========================================================
// File: useGameLogic.js
// Script con la lgoca del gioco comune/normale
// @authors: "catalin.groppo@allievi.itsdigitalacademy.com"
//           "mattia.zara@allievi.itsdigitalacademy.com"
//           "sandu.batrincea@allievi.itsdigitalacademy.com"
//           "villari.adnrea@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2026-01-01"
//=========================================================


import { useState, useCallback } from "react";
import { calculateFeedback } from "../utils/gameUtils";
import { MAX_TURNS } from "../utils/constants";

export const useGameLogic = (
  secretCode,
  mode,
  socket,
  opponentSocketId,
  isSettingCode
) => {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(Array(4).fill(null));
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("");

  const addPeg = useCallback(
    (index, selectedColor) => {
      if (gameWon || gameOver || guesses.length >= MAX_TURNS) return;
      setCurrentGuess((prev) =>
        prev.map((val, i) => (i === index ? selectedColor : val))
      );
    },
    [gameWon, gameOver, guesses.length]
  );

  const submitGuess = useCallback(
    (onGameEnd) => {
      if (gameWon || gameOver || guesses.length >= MAX_TURNS) return;
      if (!currentGuess.every((c) => c !== null)) return;
      if (secretCode.length === 0) return;

      const feedback = calculateFeedback(secretCode, currentGuess);
      const newGuesses = [...guesses, { guess: currentGuess, feedback }];
      setGuesses(newGuesses);
      const guessToSubmit = [...currentGuess];
      setCurrentGuess(Array(4).fill(null));

      // Invia tentativo al maker in modalità 1vs1
      if (mode === "versus" && socket && opponentSocketId && !isSettingCode) {
        socket.emit("send_guess", {
          targetSocketId: opponentSocketId,
          guess: guessToSubmit,
          feedback: feedback,
        });
      }

      // Controlla vittoria
      if (guessToSubmit.every((item, index) => item === secretCode[index])) {
        setGameWon(true);
        if (onGameEnd) onGameEnd(true, newGuesses.length);
        return;
      }

      // Controlla sconfitta per tentativi
      if (newGuesses.length >= MAX_TURNS) {
        setGameOver(true);
        setGameOverReason("turns");
        if (onGameEnd) onGameEnd(false, newGuesses.length);
      }
    },
    [
      gameWon,
      gameOver,
      guesses,
      currentGuess,
      secretCode,
      mode,
      socket,
      opponentSocketId,
      isSettingCode,
    ]
  );

  const resetGameState = useCallback(() => {
    setGuesses([]);
    setCurrentGuess(Array(4).fill(null));
    setGameWon(false);
    setGameOver(false);
    setGameOverReason("");
  }, []);

  return {
    guesses,
    currentGuess,
    gameWon,
    gameOver,
    gameOverReason,
    addPeg,
    submitGuess,
    resetGameState,
    setGameWon,
    setGameOver,
    setGameOverReason,
  };
};
