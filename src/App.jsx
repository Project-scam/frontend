import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./index.css";
import BombHeader from "./components/BombHeader";
import GuessRow from "./components/GuessRow";
import ColorPicker from "./components/ColorPicker";
import EndScreen from "./components/EndScreen";
import GameBoard from "./components/GameBoard";
import VersusSetup from "./components/VersusSetup";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import Modal from "./components/Modal/Modal";
import { UserList } from "./components/UserList";
import { API_URLS } from "./config";
import Btn from "./components/Btn/Btn";
import RulesOfGame from "./components/RulesOfGame";

const COLORS_BOMB = [
  "#ef4444",
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
]
const MAX_TURNS = 10;
const SOCKET_URL = "https://backend-21ia.onrender.com"; // Da configurare in base all'ambiente

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
  const [isLogged, setLogged] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isRegisterView, setRegisterView] = useState(false);
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
  const [incomingChallenge, setIncomingChallenge] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isRulesOfGame, setIsRulesOfGame] = useState(false); // apre la modale con la spiegazione delle regole di gioco

  // Gestione Finestra 
  const handleCloseModal = ()=> {
    setIsRulesOfGame(false)
  }

  const handleLogout = async () => {
    // 1. Notifica il backend per aggiornare lo stato DB

    try {
      await fetch(`${SOCKET_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // FONDAMENTALE: invia i cookie al backend
        });
    } catch (error) {
      console.error("Errore logout:", error);
    } finally {
      // 2. Pulizia stato locale e socket (eseguita SEMPRE, anche se il server dà errore)
      setLogged(false);
      setCurrentUser(null);
      if (socket) {
        socket.disconnect();
        console.log("Socket disconnesso");
        setSocket(null);
      }
    }
  };

  // Gestione Socket.io
  useEffect(() => {
    if (isLogged && !socket) {
      const newSocket = io(SOCKET_URL);

      newSocket.on("connect", () => {
        console.log("Socket connesso:", newSocket.id);
        if (currentUser) {
          newSocket.emit("register_user", currentUser);
        }
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [isLogged, currentUser]);

  // Gestisce l'inizio della partita 1vs1 attivato da UserList
  const handleGameStart = (data) => {
    setOpponent(data.opponent);
    setMode("versus");
    // Se il ruolo è 'maker', devo impostare il codice (isSettingCode = true)
    // Se il ruolo è 'breaker', aspetto (isSettingCode = false)
    setIsSettingCode(data.role === 'maker');
  };

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

 /*  if (true) return <Modal /> */
  

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

  const handleLoginSuccess = (user) => {
    console.log("Dati utenti ricevuti dal Login:", user);
    setLogged(true);
    setCurrentUser(typeof user === "string" ? user : (user?.username || "Guest"));
    // Se il backend restituisce il token nell'oggetto user (come visto nel controller), lo salviamo
    if (user?.token) localStorage.setItem("token", user.token);
    setRegisterView(false); // Assicura di tornare alla vista di gioco
  };

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

  // --- Logica di Rendering Unificata ---
  return !isLogged ? (
    // Se l'utente NON è loggato...
    isRegisterView ? (
      // ...e vuole registrarsi, mostra Registration
      <Registration
        onRegisterSuccess={handleLoginSuccess}
        onShowLogin={() => setRegisterView(false)}
      />
    ) : (
      // ...altrimenti, mostra Login
      <Login
        onLoginSuccess={handleLoginSuccess}
        onShowRegister={() => setRegisterView(true)}
        onGuestLogin={handleLoginSuccess} // Anche l'ospite viene "loggato"
      />
    )
  ) : !mode ? (
    // Se l'utente è loggato ma non ha scelto la modalità, mostra il menu
    <div className="page-wrapper">  
      <div className="mode-menu">
        <h1 className="menu-title">MASTERMIND SCAM</h1>
        <p className="menu-subtitle">Scegli la modalità o <Btn variant="simple" onClick={()=> setIsRulesOfGame(true)}>IMPARA LE REGOLE DI GIOCO</Btn></p>
       
        {/* REGOLE DEL GIOCO */}
        { isRulesOfGame && (<RulesOfGame onClose={ handleCloseModal}/>)}


    
        <button className="menu-btn" onClick={() => setMode("normal")}>
          Modalità Normale
        </button>
        <button className="menu-btn" onClick={() => setMode("versus")}>
          1 vs 1 (Codemaker / Codebreaker)
        </button>
        <button className="menu-btn" onClick={() => setMode("devil")}>
          Modalità Diavolo
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
            gap: "8px"
          }}
        >
          <LogoutIcon />
          LOGOUT
        </button>
      </div>
    </div>
  ) : mode === "versus" && isSettingCode ? (
    // Se è in modalità 1vs1 e il Giocatore 1 deve scegliere il codice
    // Se non ho ancora un avversario, mostro la lista per sceglierlo
    !opponent ? (
      <UserList
        socket={socket}
        currentUser={currentUser}
        onBack={() => setMode(null)}
        onGameStart={handleGameStart}
      />
    ) : (
      <>
        <VersusSetup
          tempCode={tempCode}
          colors={COLORS_BOMB}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          onSetCodePeg={setCodePeg}
          onConfirm={confirmSecretCode}
          onBack={() => setMode(null)}
        />

        <div style={{ color: 'white' }}>Setup contro {opponent} (WIP)</div>
      </>
    )
  ) : (
    // Altrimenti, l'utente è loggato e in partita: mostra la schermata di gioco
    <div className="page-wrapper">
      <div className="bomb-container">
        {guesses.length === 0 && !isSettingCode && (
          <div style={{ padding: "12px 16px" }}>
            <button className="back-menu-btn" onClick={() => setMode(null)}>
              ← Torna alla scelta modalità
            </button>
          </div>
        )
        }
        <BombHeader
          minutes={minutes}
          seconds={seconds}
          guessesCount={guesses.length}
          maxTurns={MAX_TURNS}
          mode={mode}
        />
        {
          (!gameWon && !gameOver) ? (
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
          ) : (
            <EndScreen
              gameWon={gameWon}
              gameOverReason={gameOverReason}
              guessesCount={guesses.length}
              secretCode={secretCode}
              onReset={resetGame}
              color={COLORS_BOMB}
            />
          )
        }
      </div >
    </div >
  );
}

export default App;
