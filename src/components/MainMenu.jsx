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
const MAX_TURNS = 10; // Modificato in 10 turni che 12

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
  const [hasStarted, setHasStarted] = useState(false); // per far partire il timer in Diavolo
  const [isSettingCode, setIsSettingCode] = useState(false); // fase in cui P1 imposta il codice (1vs1)
  const [tempCode, setTempCode] = useState(Array(4).fill(null)); // codice scelto da P1
  const [showUserList, setShowUserList] = useState(true); // Gestisce la vista UserList vs VersusSetup

  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    // Inizializza la connessione (assumendo che il backend sia su localhost:3000)
    const newSocket = io("https://pwscam-2.onrender.com");
    setSocket(newSocket);

    // Genera un nome utente temporaneo (o recuperalo da un input di login)
    const user = "Player" + Math.floor(Math.random() * 1000);
    setCurrentUser(user);

    newSocket.on("connect", () => {
      newSocket.emit("register_user", { username: user });
    });

    return () => newSocket.disconnect();
  }, []);

  // inizializza partita quando scelgo una modalità
  useEffect(() => {
    if (!mode) return;

    // reset stato comune
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
      // in 1 vs 1 il codice viene scelto dal Giocatore 1
      setSecretCode([]);
      setTimeLeft(0);
      setIsSettingCode(true);
    } else {
      // normal / devil → codice random
      setSecretCode(
        Array(4)
          .fill(0)
          .map(() => Math.floor(Math.random() * COLORS_BOMB.length))
      );
      setTimeLeft(mode === "devil" ? 60 : 0);
      setIsSettingCode(false);
    }
  }, [mode]);

  // timer solo in modalità Diavolo e solo dopo Start
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

    // vittoria solo se il tentativo coincide col codice
    if (currentGuess.every((val, idx) => val === secretCode[idx])) {
      setGameWon(true);
      return;
    }

    // esplosione per tentativi finiti
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
    // torna al menu principale
    setMode(null);
  };

  // handler per impostare il codice in 1 vs 1
  const setCodePeg = (index) => {
    setTempCode((prev) =>
      prev.map((v, i) => (i === index ? selectedColor : v))
    );
  };

  const confirmSecretCode = () => {
    if (!tempCode.every((c) => c !== null)) return;
    setSecretCode(tempCode);
    setIsSettingCode(false);
    // Giocatore 2 inizia a giocare, nessun timer in 1 vs 1
  };

  // SCHERMATA MENU MODALITÀ
  if (!mode) {
    return (
      <div className="page-wrapper">
        <div className="mode-menu">
          <h1 className="menu-title">MASTERMINDSCAM</h1>
          <p className="menu-subtitle">Scegli la modalità di gioco</p>
          <button className="menu-btn" onClick={() => setMode("normal")}>
            Modalità Normale
          </button>
          <button className="menu-btn" onClick={() => setMode("versus")}>
            1 vs 1 (Codemaker / Codebreaker)
          </button>
          <button className="menu-btn" onClick={() => setMode("devil")}>
            Modalità Diavolo
          </button>
        </div>
      </div>
    );
  }

  // FASE SCELTA CODICE (1 vs 1)
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

  // da qui in poi: partita normale (secretCode pronto)

  if (!secretCode.length) return <div>Caricamento...</div>;

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
        {/* Pulsante per tornare al menu se la partita NON è iniziata */}
        {mode &&
          guesses.length === 0 &&
          !gameWon &&
          !gameOver &&
          !isSettingCode && (
            <div style={{ padding: "12px 16px" }}>
              <button className="back-menu-btn" onClick={() => setMode(null)}>
                ← Torna alla scelta modalità
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

        {/* gioco in corso */}
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

        {/* fine partita */}
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
