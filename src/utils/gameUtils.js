//========================================================
// File: gameUtils.js
// Script che raccoglie le principali utility dell'app.
// @authror: "catalin.groppo@allievi.itsdigitalacademy.com"
//           "mattia.zara@allievi.itsdigitalacademy.com"
//           "sandu.batrincea@allievi.itsdigitalacademy.com"
//           "andrea.villari@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2026-01-01"
//=========================================================


/**
 * Calcola il feedback per un tentativo (pallini neri e bianchi)
 */
export const calculateFeedback = (secret, guess) => {
  const secretCopy = [...secret];
  const guessCopy = [...guess];
  let black = 0;
  let white = 0;

  // Pallini neri (posizione e colore corretti)
  secretCopy.forEach((val, i) => {
    if (val === guessCopy[i]) {
      black++;
      secretCopy[i] = guessCopy[i] = -1;
    }
  });

  // Pallini bianchi (colore corretto ma posizione sbagliata)
  secretCopy.forEach((val) => {
    if (val !== -1) {
      const idx = guessCopy.indexOf(val);
      if (idx !== -1) {
        white++;
        guessCopy[idx] = -1;
      }
    }
  });

  return [...Array(black).fill("black"), ...Array(white).fill("white")];
};

/**
 * Genera un codice segreto random
 */
export const generateRandomCode = (colors, length = 4) => {
  return Array(length)
    .fill(0)
    .map(() => Math.floor(Math.random() * colors.length));
};

/**
 * Calcola i punti in base al risultato
 */
export const calculatePoints = (
  won,
  guessesCount,
  basePoints = 100,
  penaltyPerGuess = 5,
  minPoints = 10
) => {
  if (!won) return 0;
  const penalty = guessesCount * penaltyPerGuess;
  return Math.max(minPoints, basePoints - penalty);
};
