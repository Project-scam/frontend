//=========================================================
// File: App.jsx
// componente principale dell'applicazione
// @authors: "catalin.groppo@allievi.itsdigitalacademy.com"
//           "mattia.zara@allievi.itsdigitalacademy.com"
//           "sandu.batrincea@allievi.itsdigitalacademy.com"
//           "villari.adnrea@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2026-01-01"
//=========================================================


import { useState, useEffect, useCallback } from "react";
import "./index.css";
import BombHeader from "./components/BombHeader";
import GameBoard from "./components/GameBoard";
import EndScreen from "./components/EndScreen";
import VersusSetup from "./components/VersusSetup";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import { UserList } from "./components/UserList";
import Btn from "./components/Btn/Btn";
import RulesOfGameDefault from "./components/RulesOfGameDefault";
import { Leaderboard } from "./components/Leaderboard";
import {
  COLORS_BOMB,
  MAX_TURNS,
  GAME_MODES,
  USER_ROLES,
} from "./utils/constants";
import { useAuth } from "./hook/useAuth";
import { useSocket } from "./hook/useSocket";
import { useGameMode } from "./hook/useGameMode";
import { useGameLogic } from "./hook/useGameLogic";
import { useDevilMode } from "./hook/useDevilMode";
import { useVersusMode } from "./hook/useVersusMode";
import { usePoints } from "./hook/usePoint";

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

function App() {
  // UI State
  const [isRulesOfGame, setIsRulesOfGame] = useState(false);
  const [isLeaderboard, setIsLeaderboard] = useState(false);

  // Auth
  const {
    isLogged,
    isLoading,
    currentUser,
    isRegisterView,
    setRegisterView,
    handleLoginSuccess,
    handleLogout,
  } = useAuth();

  // Socket
  const socket = useSocket(isLogged, currentUser);

  // Game Mode
  const {
    mode,
    setMode,
    secretCode,
    setSecretCode,
    selectedColor,
    setSelectedColor,
    resetGame: resetGameMode,
  } = useGameMode();

  // Callback per useVersusMode (stabilizzati con useCallback per evitare re-render)
  const handleSecretCodeReceived = useCallback(
    (code) => {
      setSecretCode(code);
    },
    [setSecretCode]
  );

  const handleGameEnded = useCallback(
    ({ gameWon, gameOver, gameOverReason }) => {
      setGameWon(gameWon);
      setGameOver(gameOver);
      setGameOverReason(gameOverReason);
    },
    [setGameWon, setGameOver, setGameOverReason]
  );

  // Versus Mode con callback
  const {
    opponent,
    opponentSocketId,
    userRole,
    isSettingCode,
    tempCode,
    handleGameStart,
    setCodePeg,
    confirmSecretCode: confirmCode,
    notifyGameEnd,
    resetVersusState,
  } = useVersusMode(socket, mode, {
    // ✅ Passa i callback per comunicare con gli altri hook
    onSecretCodeReceived: handleSecretCodeReceived,
    onGameEnded: handleGameEnded,
  });

  // Game Logic
  const {
    guesses,
    currentGuess,
    gameWon,
    gameOver,
    gameOverReason,
    addPeg,
    submitGuess: submitGuessBase,
    resetGameState,
    setGameWon,
    setGameOver,
    setGameOverReason,
  } = useGameLogic(secretCode, mode, socket, opponentSocketId, isSettingCode);

  // Devil Mode
  const { timeLeft, hasStarted, startGame, getTimeExpired } = useDevilMode(
    mode,
    gameWon,
    gameOver
  );

  // Points
  const { handleGameEndPoints } = usePoints();

  // Reset completo
  const resetGame = () => {
    resetGameMode();
    resetGameState();
    resetVersusState();
  };

  // Submit guess con gestione punti
  const submitGuess = () => {
    submitGuessBase((won, guessesCount) => {
      handleGameEndPoints(mode, currentUser, won, guessesCount);
      if (mode === GAME_MODES.VERSUS) {
        notifyGameEnd(won, guessesCount, currentUser, opponent);
      }
    });
  };

  // Conferma codice segreto in 1vs1
  const confirmSecretCode = () => {
    confirmCode((code) => {
      setSecretCode(code);
    });
  };

  // Gestione fine partita per maker
  // (da implementare con listener socket in useVersusMode)

  // Timer expired handler
  useEffect(() => {
    if (mode === GAME_MODES.DEVIL && getTimeExpired() && !gameOver) {
      setGameOver(true);
      setGameOverReason("timer");
    }
  }, [
    timeLeft,
    mode,
    gameOver,
    getTimeExpired,
    setGameOver,
    setGameOverReason,
  ]);

  // Calcoli UI
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const mainButtonDisabled =
    mode === GAME_MODES.DEVIL && !hasStarted
      ? false
      : gameWon ||
        gameOver ||
        !currentGuess.every((c) => c !== null) ||
        secretCode.length === 0;

  const mainButtonLabel =
    mode === GAME_MODES.DEVIL && !hasStarted ? "START" : "DEFUSE NOW";

  const mainButtonOnClick =
    mode === GAME_MODES.DEVIL && !hasStarted ? startGame : submitGuess;

  // Rendering
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "white",
          fontSize: "1.5rem",
        }}
      >
        Caricamento...
      </div>
    );
  }

  if (isLeaderboard) {
    return <Leaderboard onClose={() => setIsLeaderboard(false)} />;
  }

  if (!isLogged) {
    return isRegisterView ? (
      <Registration
        onRegisterSuccess={handleLoginSuccess}
        onShowLogin={() => setRegisterView(false)}
      />
    ) : (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onShowRegister={() => setRegisterView(true)}
        onGuestLogin={handleLoginSuccess}
      />
    );
  }

  if (!mode) {
    return (
      <div className="page-wrapper">
        <div className="mode-menu">
          <h1 className="menu-title">MASTERMIND SCAM</h1>
          <p className="menu-subtitle">
            Scegli la modalità o{" "}
            <Btn variant="simple" onClick={() => setIsRulesOfGame(true)}>
              IMPARA LE REGOLE DI GIOCO
            </Btn>
          </p>

          {isRulesOfGame && (
            <RulesOfGameDefault onClose={() => setIsRulesOfGame(false)} />
          )}

          <button
            className="menu-btn"
            onClick={() => setMode(GAME_MODES.NORMAL)}
          >
            Modalità Normale
          </button>
          <button
            className="menu-btn"
            onClick={() => {
              if (currentUser === "Guest") {
                alert("This mode is reserved to registered users only!");
                return;
              }
              setMode(GAME_MODES.VERSUS);
            }}
            style={
              currentUser === "Guest"
                ? { opacity: 0.5, cursor: "not-allowed" }
                : {}
            }
          >
            1 vs 1 (Codemaker / Codebreaker) {currentUser === "Guest" && "🔒"}
          </button>
          <button
            className="menu-btn"
            onClick={() => setMode(GAME_MODES.DEVIL)}
          >
            Modalità Diavolo
          </button>
          <button
            className="menu-btn"
            onClick={() => {
              if (currentUser === "Guest") {
                alert("This ranking is reserved to registered users only!");
                return;
              }
              setIsLeaderboard(true);
            }}
            style={
              currentUser === "Guest"
                ? { opacity: 0.5, cursor: "not-allowed" }
                : {}
            }
          >
            Ranking {currentUser === "Guest" && "🔒"}
          </button>
          <button
            className="menu-btn"
            onClick={handleLogout}
            style={{
              marginTop: "24px",
              background: "linear-gradient(135deg, #4b5563, #374151)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <LogoutIcon />
            LOGOUT
          </button>
        </div>
      </div>
    );
  }

  // Versus Setup
  if (mode === GAME_MODES.VERSUS && isSettingCode) {
    return !opponent ? (
      <UserList
        socket={socket}
        currentUser={currentUser}
        onBack={resetGame}
        onGameStart={handleGameStart}
      />
    ) : (
      <>
        <VersusSetup
          tempCode={tempCode}
          colors={COLORS_BOMB}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          onSetCodePeg={(index) => setCodePeg(index, selectedColor)}
          onConfirm={confirmSecretCode}
          onBack={resetGame}
        />
        <div style={{ color: "white" }}>Setup contro {opponent}</div>
      </>
    );
  }

  // Maker waiting screen
  if (
    mode === GAME_MODES.VERSUS &&
    userRole === USER_ROLES.MAKER &&
    !isSettingCode
  ) {
    return (
      <div className="page-wrapper">
        <div className="bomb-container">
          <div style={{ padding: "12px 16px" }}>
            <button className="back-menu-btn" onClick={resetGame}>
              ← Torna alla scelta modalità
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#10b981", marginBottom: "20px" }}>
              Codice Segreto Inviato!
            </h2>
            <p
              style={{
                color: "#d1d5db",
                marginBottom: "30px",
                fontSize: "18px",
              }}
            >
              Stai aspettando che{" "}
              <strong style={{ color: "#60a5fa" }}>{opponent}</strong> indovini
              il tuo codice...
            </p>
            {gameWon || gameOver ? (
              <div style={{ marginTop: "20px" }}>
                <p
                  style={{
                    color: gameWon ? "#10b981" : "#ef4444",
                    fontSize: "20px",
                    marginBottom: "20px",
                  }}
                >
                  {gameWon
                    ? "🎉 Il tuo avversario ha vinto!"
                    : "💥 Il tuo avversario ha perso!"}
                </p>
                <button className="defuse-btn" onClick={resetGame}>
                  NUOVA PARTITA
                </button>
              </div>
            ) : (
              <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                In attesa del risultato...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="page-wrapper">
      <div className="bomb-container">
        {guesses.length === 0 &&
          !isSettingCode &&
          userRole !== USER_ROLES.MAKER && (
            <div style={{ padding: "12px 16px" }}>
              <button className="back-menu-btn" onClick={resetGame}>
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
        {!gameWon && !gameOver ? (
          userRole === USER_ROLES.BREAKER || mode !== GAME_MODES.VERSUS ? (
            <GameBoard
              guesses={guesses}
              currentGuess={currentGuess}
              colors={COLORS_BOMB}
              canPlay={guesses.length < MAX_TURNS && secretCode.length > 0}
              onPegClick={(index) => addPeg(index, selectedColor)}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              mainButtonLabel={mainButtonLabel}
              mainButtonDisabled={mainButtonDisabled}
              mainButtonOnClick={mainButtonOnClick}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#d1d5db", fontSize: "18px" }}>
                In attesa che{" "}
                <strong style={{ color: "#60a5fa" }}>{opponent}</strong>{" "}
                indovini il tuo codice...
              </p>
            </div>
          )
        ) : (
          <EndScreen
            gameWon={gameWon}
            gameOverReason={gameOverReason}
            guessesCount={guesses.length}
            secretCode={secretCode}
            onReset={resetGame}
            colors={COLORS_BOMB}
          />
        )}
      </div>
    </div>
  );
}

export default App;
