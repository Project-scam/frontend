
import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal/Modal";


export const UserList = ({ socket, currentUser, onBack, onGameStart }) => {
  const [users, setUsers] = useState([]);
  const [pendingChallenge, setPendingChallenge] = useState(null);
  const [incomingChallenge, setIncomingChallenge] = useState(null);

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

  // Usa ref per accedere ai valori correnti nei callback
  const pendingChallengeRef = useRef(pendingChallenge);
  const onGameStartRef = useRef(onGameStart);

  // Aggiorna i ref quando i valori cambiano
  useEffect(() => {
    pendingChallengeRef.current = pendingChallenge;
  }, [pendingChallenge]);

  useEffect(() => {
    onGameStartRef.current = onGameStart;
  }, [onGameStart]);

  useEffect(() => {
    if (!socket) return;

    // Richiedi la lista utenti appena il componente viene montato
    socket.emit("get_users");

    const handleUsersList = (list) => {
      // Filtra te stesso dalla lista
      setUsers(list.filter((u) => u.username !== currentUser));
    };

    const handleChallengeReceived = (data) => {
      setIncomingChallenge(data);
    };

    const handleChallengeDeclined = () => {
      console.log("[UserList] Challenge declined");
      setPendingChallenge(null);
      setModalConfig({
        title: "Challenge Update",
        message: "The challenge was refused or the user disconnected.",
        textColor: "red",
        textColorSubtitle: "black"
      });
      setShowModal(true);
    };

    const handleChallengeAccepted = (data) => {
      // Se avevo una sfida in sospeso verso questo utente, sono io lo sfidante (Maker)
      // Altrimenti, ho accettato io la sfida, quindi sono il Breaker
      const isMyChallenge = pendingChallenge === data.opponentSocketId;
      if (onGameStart) onGameStart({ ...data, role: isMyChallenge ? 'maker' : 'breaker' });
    };

    socket.on("users_list_update", handleUsersList);
    socket.on("challenge_received", handleChallengeReceived);
    socket.on("challenge_declined", handleChallengeDeclined);
    socket.on("challenge_accepted", handleChallengeAccepted);

    return () => {
      socket.off("users_list_update", handleUsersList);
      socket.off("challenge_received", handleChallengeReceived);
      socket.off("challenge_declined", handleChallengeDeclined);
      socket.off("challenge_accepted", handleChallengeAccepted);
    };
  }, [socket, currentUser, onGameStart, pendingChallenge]);

  const sendChallenge = (targetSocketId) => {
    socket.emit("send_challenge", { targetSocketId });
    setPendingChallenge(targetSocketId);
  };

  const handleAcceptChallenge = () => {
    if (incomingChallenge) {
      socket.emit("accept_challenge", { challengerId: incomingChallenge.socketId });
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
        <h2 className="menu-title">Online Challengers</h2>

        {users.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center" }}>
            No users online.
          </p>
        ) : (
          <div className="user-list" style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            {users.map((user) => (
              <div
                key={user.socketId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.1)",
                  padding: "10px 15px",
                  borderRadius: "8px"
                }}
              >
                <span style={{
                  color: "#fff",
                  fontWeight: "bold",
                  maxWidth: "200px",
                  overflowX: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block"
                }}>{user.username}</span>
                <button
                  className="menu-btn"
                  style={{ width: "auto", padding: "8px 16px", fontSize: "14px", margin: 0, backgroundColor: "rgba(239, 239, 239, 0.3)" }}
                  onClick={() => sendChallenge(user.socketId)}
                  disabled={!!pendingChallenge}
                >
                  {pendingChallenge === user.socketId ? "Waiting..." : "Challenge"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modale per Sfida in Arrivo */}
        {incomingChallenge && (
          <Modal
            title="Challenge Received!"
            subtitle={`${incomingChallenge.username} wants to play with you.`}
            textColor="green" // O un altro colore appropriato per una notifica positiva/neutra
            textColorSubtitle="black"
          >
            <button className="menu-btn" onClick={handleAcceptChallenge} style={{ marginBottom: "10px", marginTop: "20px" }}>ACCEPT</button>
            <button className="menu-btn" onClick={handleDeclineChallenge} style={{ backgroundColor: "#ef4444" }}>DENY</button>
          </Modal>
        )}

        {showModal && (
          <Modal
            onClose={handleCloseModal}
            title={modalConfig.title}
            subtitle={modalConfig.message}
            textColor={modalConfig.textColor}
            textColorSubtitle={modalConfig.textColorSubtitle}
          />
        )}

        <button className="back-menu-btn" onClick={onBack} style={{ marginTop: "20px" }}>
          ← Back to Menu
        </button>
      </div>
    </div>
  );
};
