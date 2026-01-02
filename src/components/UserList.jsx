import React, { useState, useEffect } from "react";

export const UserList = ({ socket, currentUser, onBack, onGameStart }) => {
  const [users, setUsers] = useState([]);
  const [pendingChallenge, setPendingChallenge] = useState(null);
  const [incomingChallenge, setIncomingChallenge] = useState(null);

  useEffect(() => {
    if (!socket) {
      console.log("[UserList] Socket non disponibile");
      return;
    }

    const handleUsersList = (list) => {
      console.log("[UserList] Lista utenti ricevuta:", list);
      // Filtra te stesso dalla lista
      const filteredUsers = list.filter((u) => u.username !== currentUser);
      console.log("[UserList] Utenti filtrati:", filteredUsers);
      setUsers(filteredUsers);
    };

    const handleChallengeReceived = (data) => {
      setIncomingChallenge(data);
    };

    const handleChallengeDeclined = () => {
      setPendingChallenge(null);
      alert("The challenge is refused or the user is disconnected.");
    };

    const handleChallengeAccepted = (data) => {
      // Se avevo una sfida in sospeso verso questo utente, sono io lo sfidante (Maker)
      // Altrimenti, ho accettato io la sfida, quindi sono il Breaker
      const isMyChallenge = pendingChallenge === data.opponentSocketId;
      if (onGameStart)
        onGameStart({ ...data, role: isMyChallenge ? "maker" : "breaker" });
    };

    // Registra i listener PRIMA di emettere l'evento
    socket.on("users_list_update", handleUsersList);
    socket.on("challenge_received", handleChallengeReceived);
    socket.on("challenge_declined", handleChallengeDeclined);
    socket.on("challenge_accepted", handleChallengeAccepted);

    // Funzione per richiedere la lista utenti
    const requestUsersList = () => {
      if (socket.connected) {
        console.log("[UserList] Socket connesso, richiedo lista utenti");
        socket.emit("get_users");
      } else {
        console.log("[UserList] Socket non ancora connesso, in attesa...");
      }
    };

    // Se il socket è già connesso, richiedi subito la lista
    if (socket.connected) {
      requestUsersList();
    } else {
      // Altrimenti aspetta la connessione
      socket.once("connect", requestUsersList);
    }

    return () => {
      socket.off("users_list_update", handleUsersList);
      socket.off("challenge_received", handleChallengeReceived);
      socket.off("challenge_declined", handleChallengeDeclined);
      socket.off("challenge_accepted", handleChallengeAccepted);
      socket.off("connect", requestUsersList);
    };
  }, [socket, currentUser, onGameStart, pendingChallenge]);

  const sendChallenge = (targetSocketId) => {
    socket.emit("send_challenge", { targetSocketId });
    setPendingChallenge(targetSocketId);
  };

  const handleAcceptChallenge = () => {
    if (incomingChallenge) {
      socket.emit("accept_challenge", {
        challengerId: incomingChallenge.socketId,
      });
      setIncomingChallenge(null);
      // Qui potresti aggiungere una callback onGameStart() se gestita dal genitore
    }
  };

  const handleDeclineChallenge = () => {
    setIncomingChallenge(null);
  };

  return (
    <div className="page-wrapper">
      <div className="mode-menu" style={{ maxWidth: "600px" }}>
        <h2 className="menu-title">Challengers Online</h2>

        {users.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center" }}>
            No Users online.
          </p>
        ) : (
          <div
            className="user-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}
          >
            {users.map((user) => (
              <div
                key={user.socketId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.1)",
                  padding: "10px 15px",
                  borderRadius: "8px",
                }}
              >
                <span style={{ color: "#fff", fontWeight: "bold" }}>
                  {user.username}
                </span>
                <button
                  className="menu-btn"
                  style={{
                    width: "auto",
                    padding: "8px 16px",
                    fontSize: "14px",
                    margin: 0,
                  }}
                  onClick={() => sendChallenge(user.socketId)}
                  disabled={!!pendingChallenge}
                >
                  {pendingChallenge === user.socketId
                    ? "Waiting..."
                    : "Challenge"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modale per Sfida in Arrivo */}
        {incomingChallenge && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#1f2937",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center",
                border: "1px solid #374151",
                minWidth: "300px",
              }}
            >
              <h3 style={{ color: "#fff", marginBottom: "15px" }}>
                Challenge received!
              </h3>
              <p style={{ color: "#d1d5db", marginBottom: "20px" }}>
                <strong style={{ color: "#60a5fa" }}>
                  {incomingChallenge.username}
                </strong>{" "}
                wants to play with you.
              </p>
              <button
                className="menu-btn"
                onClick={handleAcceptChallenge}
                style={{ marginBottom: "10px" }}
              >
                ACCEPT
              </button>
              <button
                className="menu-btn"
                onClick={handleDeclineChallenge}
                style={{ backgroundColor: "#ef4444" }}
              >
                DENAY
              </button>
            </div>
          </div>
        )}

        <button
          className="back-menu-btn"
          onClick={onBack}
          style={{ marginTop: "20px" }}
        >
          ← Turn back to Menu
        </button>
      </div>
    </div>
  );
};
