//=========================================================
// File: App.jsx
// componente principale dell'applicazione
// @authors: "catalin.groppo@allievi.itsdigitalacademy.com"
//           "mattia.zara@allievi.itsdigitalacademy.com"
//           "sandu.batrincea@allievi.itsdigitalacademy.com"
//           "villari.adnrea@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2026-01-01"
//=========================================================

import { useState, useEffect, useCallback, useRef } from "react";
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
import Modal from "./components/Modal/Modal";


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
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    textColor: "black",
    textColorSubtitle: "black"
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setModalConfig({
      title: "",
      message: "",
      textColor: "black",
      textColorSubtitle: "black"
    });
  };

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

  // Callback per useVersusMode - definiti PRIMA ma useranno funzioni da hook successivi
  // Usiamo useRef per memorizzare i setter che verranno definiti dopo
  const gameLogicSettersRef = useRef({
    setGameWon: null,
    setGameOver: null,
    setGameOverReason: null,
  });

  const handleSecretCodeReceived = useCallback(
    (code) => {
      setSecretCode(code);
    },
    [setSecretCode]
  );

  const handleGameEnded = useCallback(
    ({ gameWon, gameOver, gameOverReason }) => {
      // Usa i setter dal ref che verranno aggiornati dopo useGameLogic
      if (gameLogicSettersRef.current.setGameWon) {
        gameLogicSettersRef.current.setGameWon(gameWon);
      }
      if (gameLogicSettersRef.current.setGameOver) {
        gameLogicSettersRef.current.setGameOver(gameOver);
      }
      if (gameLogicSettersRef.current.setGameOverReason) {
        gameLogicSettersRef.current.setGameOverReason(gameOverReason);
      }
    },
    []
  );

  // Versus Mode - chiamato con i callback (che useranno il ref per i setter)
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
    onSecretCodeReceived: handleSecretCodeReceived,
    onGameEnded: handleGameEnded,
  });

  // Game Logic - chiamato DOPO useVersusMode per avere opponentSocketId e isSettingCode
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

  // Aggiorna il ref con i setter da useGameLogic
  useEffect(() => {
    gameLogicSettersRef.current = {
      setGameWon,
      setGameOver,
      setGameOverReason,
    };
  }, [setGameWon, setGameOver, setGameOverReason]);

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
          Loading...
        </div>
    );
  }

  /*
  // TEMPORARY BYPASS: Display UserList  for testing
  if (showUserListDirectlyForTest) {
    return (
      <div className="page-wrapper">
        <button
          onClick={() => setShowUserListDirectlyForTest(false)}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "#ef4444",
            color: "white",
            padding: "8px 12px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          Exit Test Mode
        </button>
        <UserList
          socket={socket}
          currentUser={currentUser || "GuestUserForTest"}
          onBack={() => setShowUserListDirectlyForTest(false)}
          onGameStart={handleGameStart}
        />
      </div>
    );
  }
  */

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
            Choose a game mode or{" "}
            <Btn variant="simple" onClick={() => setIsRulesOfGame(true)}>
              LEARN THE GAME RULES
            </Btn>
          </p>

          {isRulesOfGame && (
            <RulesOfGameDefault onClose={() => setIsRulesOfGame(false)} />
          )}

          <button
            className="menu-btn"
            onClick={() => setMode(GAME_MODES.NORMAL)}
          >
            Normal Mode
          </button>
          <button
            className="menu-btn"
            onClick={() => {
              if (currentUser === "Guest") {
                setModalConfig({
                  title: "Restricted Mode",
                  message: "This mode is reserved for registered users only!",
                  textColor: "red",
                  textColorSubtitle: "black",
                });
                setShowModal(true);
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
            Devil Mode
          </button>
          <button
            className="menu-btn"
            onClick={() => {
              if (currentUser === "Guest") {
                setModalConfig({
                  title: "Restricted Access",
                  message: "This ranking is reserved for registered users only!",
                  textColor: "red",
                  textColorSubtitle: "black",
                });
                setShowModal(true);
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
            Leaderboard {currentUser === "Guest" && "🔒"}
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

  // Versus Setup - mostra UserList se non c'è ancora un opponent
  if (mode === GAME_MODES.VERSUS && !opponent) {
    return (
      <UserList
        socket={socket}
        currentUser={currentUser}
        onBack={resetGame}
        onGameStart={handleGameStart}
      />
    );
  }

  // Versus Setup - mostra VersusSetup se c'è un opponent e isSettingCode è true
  if (mode === GAME_MODES.VERSUS && opponent && isSettingCode) {
    return (
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
        <div style={{ color: "white" }}>Setup against {opponent}</div>
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
              ← Back to mode selection
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
              Secret Code Sent!
            </h2>
            <p
              style={{
                color: "#d1d5db",
                marginBottom: "30px",
                fontSize: "18px",
              }}
            >
              You are waiting for{" "}
              <strong style={{ color: "#60a5fa" }}>{opponent}</strong> to guess
              your code...
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
                    ? "🎉 Your opponent won!"
                    : "💥 Your opponent lost!"}
                </p>
                <button className="defuse-btn" onClick={resetGame}>
                  NEW GAME
                </button>
              </div>
            ) : (
              <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                Waiting for the result...
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
              Waiting for{" "}
              <strong style={{ color: "#60a5fa" }}>{opponent}</strong>{" "}
              to guess your code...
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
      {showModal && (
        <Modal
          onClose={handleCloseModal}
          title={modalConfig.title}
          subtitle={modalConfig.message}
          textColor={modalConfig.textColor}
          textColorSubtitle={modalConfig.textColorSubtitle}
        />
      )}
    </div>
  );
}

export default App;