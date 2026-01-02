import React from "react";
import "../index.css";
import BombHeader from "./BombHeader";
import GuessRow from "./GuessRow";
import ColorPicker from "./ColorPicker";
import EndScreen from "./EndScreen";
import GameBoard from "./GameBoard";
import VersusSetup from "./VersusSetup";
import { UserList } from "./UserList";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const COLORS_BOMB = [
  "#ef4444",
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
];
const MAX_TURNS = 10; // Changed to 10 turns from 12

export default function MainMenu() {
  const [mode, setMode] = useState(null); // null | 'normal' | 'devil' | 'versus'
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(Array(4).fill(null));
  const [selectedColor, setSelectedColor] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("");
  const [secretCode, setSecretCode] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasStarted, setHasStarted] = useState(false); // to start the timer in Devil mode
  const [isSettingCode, setIsSettingCode] = useState(false); // phase where P1 sets the code (1vs1)
  const [tempCode, setTempCode] = useState(Array(4).fill(null)); // code chosen by P1
  const [showUserList, setShowUserList] = useState(true); // Manages the UserList vs VersusSetup view

  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    // Initializes the connection (assuming the backend is on localhost:3000)
    const newSocket = io("https://pwscam-2.onrender.com");
    setSocket(newSocket);

    // Generates a temporary username (or retrieves it from a login input)
    const user = "Player" + Math.floor(Math.random() * 1000);
    setCurrentUser(user);

    newSocket.on("connect", () => {
      newSocket.emit("register_user", { username: user });
    });

    return () => newSocket.disconnect();
  }, []);

  // initializes game when a mode is chosen
  useEffect(() => {
    if (!mode) return;

    // reset common state
    setGuesses([]);
    setCurrentGuess(Array(4).fill(null));
    setSelectedColor(0);
    setGameWon(false);
    setGameOver(false);
    setGameOverReason("");
    setHasStarted(false);
    setTempCode(Array(4).fill(null));
    setShowUserList(true); // Reset della vista lista utenti

    if (mode === "versus") {
      // in 1 vs 1 the code is chosen by Player 1
      setSecretCode([]);
      setTimeLeft(0);
      setIsSettingCode(true);
    } else {
      // normal / devil → random code
      setSecretCode(
        Array(4)
          .fill(0)
          .map(() => Math.floor(Math.random() * COLORS_BOMB.length))
      );
      setTimeLeft(mode === "devil" ? 60 : 0);
      setIsSettingCode(false);
    }
  }, [mode]);

  // timer only in Devil mode and only after Start
  useEffect(() => {
    if (mode !== "devil") return;
    if (!hasStarted) return;
    if (gameWon || gameOver) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      setGameOverReason("timer");
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameWon, gameOver, mode, hasStarted]);

  const addPeg = (index) => {
    if (gameWon || gameOver || guesses.length >= MAX_TURNS) return;
    setCurrentGuess((prev) =>
      prev.map((val, i) => (i === index ? selectedColor : val))
    );
  };

  const submitGuess = () => {
    if (gameWon || gameOver || guesses.length >= MAX_TURNS) return;
    if (!currentGuess.every((c) => c !== null)) return;

    const feedback = calculateFeedback(secretCode, currentGuess);
    const newGuesses = [...guesses, { guess: currentGuess, feedback }];
    setGuesses(newGuesses);
    setCurrentGuess(Array(4).fill(null));

    // win only if the attempt matches the code
    if (currentGuess.every((val, idx) => val === secretCode[idx])) {
      setGameWon(true);
      return;
    }

    // explosion for finished attempts
    if (newGuesses.length >= MAX_TURNS) {
      setGameOver(true);
      setGameOverReason("turns");
    }
  };

  const calculateFeedback = (secret, guess) => {
    const secretCopy = [...secret];
    const guessCopy = [...guess];
    let black = 0;
    let white = 0;

    // neri
    secretCopy.forEach((val, i) => {
      if (val === guessCopy[i]) {
        black++;
        secretCopy[i] = guessCopy[i] = -1;
      }
    });

    // bianchi
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

  const resetGame = () => {
    // returns to the main menu
    setMode(null);
  };

  // handler to set the code in 1 vs 1
  const setCodePeg = (index) => {
    setTempCode((prev) =>
      prev.map((v, i) => (i === index ? selectedColor : v))
    );
  };

  const confirmSecretCode = () => {
    if (!tempCode.every((c) => c !== null)) return;
    setSecretCode(tempCode);
    setIsSettingCode(false);
    // Player 2 starts playing, no timer in 1 vs 1
  };

  // MODE MENU SCREEN
  if (!mode) {
    return (
      <div className="page-wrapper">
        <div className="mode-menu">
          <h1 className="menu-title">MASTERMINDSCAM</h1>
          <p className="menu-subtitle">Choose a game mode</p>
          <button className="menu-btn" onClick={() => setMode("normal")}>
            Normal Mode
          </button>
          <button className="menu-btn" onClick={() => setMode("versus")}>
            1 vs 1 (Codemaker / Codebreaker)
          </button>
          <button className="menu-btn" onClick={() => setMode("devil")}>
            Devil Mode
          </button>
        </div>
      </div>
    );
  }

  // CODE SELECTION PHASE (1 vs 1)
  if (mode === "versus" && isSettingCode) {
    if (showUserList) {
      return (
        <UserList
          socket={socket}
          currentUser={currentUser}
          onBack={() => setMode(null)}
          onGameStart={(data) => setShowUserList(false)}
        />
      );
    } else {
      return (
        <VersusSetup
          tempCode={tempCode}
          colors={COLORS_BOMB}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          onSetCodePeg={setCodePeg}
          onConfirm={confirmSecretCode}
          onBack={() => setMode(null)}
        />
      );
    }
  }

  // from here on: normal game (secretCode ready)

  if (!secretCode.length) return <div>Loading...</div>;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const mainButtonDisabled =
    mode === "devil" && !hasStarted
      ? false
      : gameWon || gameOver || !currentGuess.every((c) => c !== null);

  const mainButtonLabel =
    mode === "devil" && !hasStarted ? "START" : "DEFUSE NOW";

  const mainButtonOnClick =
    mode === "devil" && !hasStarted ? () => setHasStarted(true) : submitGuess;

  return (
    <div className="page-wrapper">
      <div className="bomb-container">
        {/* Button to return to menu if the game has NOT started */}
        {mode &&
          guesses.length === 0 &&
          !gameWon &&
          !gameOver &&
          !isSettingCode && (
            <div style={{ padding: "12px 16px" }}>
              <button className="back-menu-btn" onClick={() => setMode(null)}>
                ← Back to mode selection
              </button>
            </div>
          )}

        <BombHeader
          minutes={minutes}
          seconds={seconds}
          guessesCount={guesses.length}
          maxTurns={MAX_TURNS}
          mode={mode}
        />

        {/* game in progress */}
        {!gameWon && !gameOver && (
          <GameBoard
            guesses={guesses}
            currentGuess={currentGuess}
            colors={COLORS_BOMB}
            canPlay={guesses.length < MAX_TURNS}
            onPegClick={addPeg}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            mainButtonLabel={mainButtonLabel}
            mainButtonDisabled={mainButtonDisabled}
            mainButtonOnClick={mainButtonOnClick}
          />
        )}

        {/* end game */}
        {(gameWon || gameOver) && (
          <EndScreen
            gameWon={gameWon}
            gameOverReason={gameOverReason}
            guessesCount={guesses.length}
            secretCode={secretCode}
            onReset={resetGame} // torna al menu
          />
        )}
      </div>
    </div>
  );
}
