//======================================================
// File: usePoint.js
// Script per gestione del punteggio
// @author: "catalin.groppo@allievi.itsdigitalacademy.com"
//          "mattia.zarea@allievi.itsdigitalacademy.com"
//          "sandu.batrincea@allievi.itsdigitalacademy.com
//          "andrea.villari@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2026-01-01"
//========================================================


import { API_BASE_URL } from "../config";
import { calculatePoints as calcPoints } from "../utils/gameUtils";

export const usePoints = () => {
  const updatePoints = async (email, pointsToAdd) => {
    try {
      const response = await fetch(`${API_BASE_URL}/points/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, pointsToAdd }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Points updated successfully:", data);
        return data;
      } else {
        console.error("Error updating points:", await response.text());
        return null;
      }
    } catch (error) {
      console.error("API call error for points:", error);
      return null;
    }
  };

  const handleGameEndPoints = (mode, currentUser,currentUserEmail, gameWon, guessesCount) => {
    if (mode === "versus" && currentUser && currentUser !== "Guest") {
      const points = calcPoints(gameWon, guessesCount);
      updatePoints(currentUserEmail, gameWon ? points : 0);
    }
  };

  return { updatePoints, handleGameEndPoints };
};
