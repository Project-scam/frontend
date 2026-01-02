//========================================================
// File: gameUtils.js
// Script that collects the main utilities of the app.
// @authror: "catalin.groppo@allievi.itsdigitalacademy.com"
//           "mattia.zara@allievi.itsdigitalacademy.com"
//           "sandu.batrincea@allievi.itsdigitalacademy.com"
//           "andrea.villari@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2026-01-01"
//=========================================================


/**
 * Calculates feedback for a guess (black and white pegs)
 */
export const calculateFeedback = (secret, guess) => {
  const secretCopy = [...secret];
  const guessCopy = [...guess];
  let black = 0;
  let white = 0;

  // Black pegs (correct position and color)
  secretCopy.forEach((val, i) => {
    if (val === guessCopy[i]) {
      black++;
      secretCopy[i] = guessCopy[i] = -1;
    }
  });

  // White pegs (correct color but wrong position)
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
 * Generates a random secret code
 */
export const generateRandomCode = (colors, length = 4) => {
  return Array(length)
    .fill(0)
    .map(() => Math.floor(Math.random() * colors.length));
};

/**
 * Calculates points based on the result
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
