//========================================================
// File: useVersusMode.js
// Script per la gestione della modalità di gioco 1vs1
// @authors: "catalin.groppo@allievi.itsdigitalacademy.com"
//           "mattia.zara@allievi.itsdigitalacademy.com"
//           "sandu.batrincea@allievi.itsdigitalacademy.com"
//           "villari.adnrea@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2026-01-01"
//=========================================================


import { useState, useEffect, useCallback } from "react";
import { USER_ROLES } from "../utils/constants";

export const useVersusMode = (socket, mode, callbacks = {}) => {
  const {
    onSecretCodeReceived, // Callback per aggiornare secretCode quando il breaker riceve il codice
    onGameEnded, // Callback per aggiornare gameWon/gameOver quando il maker riceve la notifica
  } = callbacks;

  const [opponent, setOpponent] = useState(null);
  const [opponentSocketId, setOpponentSocketId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isSettingCode, setIsSettingCode] = useState(false);
  const [tempCode, setTempCode] = useState(Array(4).fill(null));

  const handleGameStart = useCallback((data) => {
    setOpponent(data.opponent);
    setOpponentSocketId(data.opponentSocketId);
    setUserRole(data.role);
    setIsSettingCode(data.role === USER_ROLES.MAKER);
  }, []);

  const setCodePeg = (index, selectedColor) => {
    setTempCode((prev) =>
      prev.map((v, i) => (i === index ? selectedColor : v))
    );
  };

  const confirmSecretCode = (onCodeSent) => {
    if (!tempCode.every((c) => c !== null)) return false;
    if (!socket || !opponentSocketId) {
      alert("Errore: connessione non disponibile");
      return false;
    }

    setIsSettingCode(false);
    socket.emit("send_secret_code", {
      targetSocketId: opponentSocketId,
      secretCode: tempCode,
    });

    if (onCodeSent) onCodeSent(tempCode);
    return true;
  };

  const notifyGameEnd = (gameWon, guessesCount, currentUser, opponent) => {
    if (mode !== "versus" || !socket || !opponentSocketId) return;
    socket.emit("game_ended", {
      targetSocketId: opponentSocketId,
      gameWon,
      guessesCount,
      winner: gameWon ? currentUser : opponent,
    });
  };

  // Listener per codice segreto e fine partita
  useEffect(() => {
    if (!socket || mode !== "versus") return;

    const handleSecretCodeReceived = (data) => {
      // Solo il breaker riceve il codice segreto
      if (userRole === USER_ROLES.BREAKER && !isSettingCode) {
        console.log("Codice segreto ricevuto:", data.secretCode);
        // ✅ Chiama il callback per aggiornare secretCode in useGameMode
        if (onSecretCodeReceived) {
          onSecretCodeReceived(data.secretCode);
        }
      }
    };

    const handleGameEnded = (data) => {
      // Solo il maker riceve la notifica di fine partita
      if (userRole === USER_ROLES.MAKER) {
        console.log("Partita terminata:", data);
        // ✅ Chiama il callback per aggiornare gameWon/gameOver in useGameLogic
        if (onGameEnded) {
          onGameEnded({
            gameWon: data.gameWon,
            gameOver: !data.gameWon,
            gameOverReason: data.gameWon ? "" : "turns",
          });
        }
      }
    };

    socket.on("game_start", handleGameStart);
    socket.on("secret_code_received", handleSecretCodeReceived);
    socket.on("game_ended_notification", handleGameEnded);

    return () => {
      socket.off("game_start", handleGameStart);
      socket.off("secret_code_received", handleSecretCodeReceived);
      socket.off("game_ended_notification", handleGameEnded);
    };
  }, [
    socket,
    mode,
    userRole,
    isSettingCode,
    onSecretCodeReceived,
    onGameEnded,
    handleGameStart,
  ]);

  const resetVersusState = () => {
    setOpponent(null);
    setOpponentSocketId(null);
    setUserRole(null);
    setIsSettingCode(false);
    setTempCode(Array(4).fill(null));
  };

  return {
    opponent,
    opponentSocketId,
    userRole,
    isSettingCode,
    tempCode,
    handleGameStart,
    setCodePeg,
    confirmSecretCode,
    notifyGameEnd,
    resetVersusState,
  };
};
