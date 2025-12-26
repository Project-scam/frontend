
import React, { useState, useEffect } from "react";

export const UserList = ({ socket, currentUser, onBack }) => {
  const [users, setUsers] = useState([]);
  const [pendingChallenge, setPendingChallenge] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Richiedi la lista utenti appena il componente viene montato
    socket.emit("get_users");

    const handleUsersList = (list) => {
      // Filtra te stesso dalla lista
      setUsers(list.filter((u) => u.username !== currentUser));
    };

    const handleChallengeDeclined = () => {
      setPendingChallenge(null);
      alert("La sfida è stata rifiutata o l'utente si è disconnesso.");
    };

    socket.on("users_list_update", handleUsersList);
    socket.on("challenge_declined", handleChallengeDeclined);

    return () => {
      socket.off("users_list_update", handleUsersList);
      socket.off("challenge_declined", handleChallengeDeclined);
    };
  }, [socket, currentUser]);

  const sendChallenge = (targetSocketId) => {
    socket.emit("send_challenge", { targetSocketId });
    setPendingChallenge(targetSocketId);
  };

  return (
    <div className="page-wrapper">
      <div className="mode-menu" style={{ maxWidth: "600px" }}>
        <h2 className="menu-title">Sfidanti Online</h2>
        
        {users.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center" }}>
            Nessun altro utente online al momento.
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
                <span style={{ color: "#fff", fontWeight: "bold" }}>{user.username}</span>
               <button
                  className="menu-btn"
                  style={{ width: "auto", padding: "8px 16px", fontSize: "14px", margin: 0 }}
                  onClick={() => sendChallenge(user.socketId)}
                  disabled={!!pendingChallenge}
               >
                  {pendingChallenge === user.socketId ? "In attesa..." : "SFIDA"}
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="back-menu-btn" onClick={onBack} style={{ marginTop: "20px" }}>
          ← Torna al Menu
        </button>
      </div>
    </div>
  );
};
