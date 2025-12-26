//==============================================================
// File: UserList.jsx
// lista degli utenti logggati e non (per sceglie uno sfidante)
// @authors: "mattia.zara@allievi.itsdigitalacademy.com"
//           "mattia.zara@allievi.itsdigitalacademy.com"
//           "mattia.zara@allievi.itsdigitalacademy.com"
//           "mattia.zara@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2025-12-23"
//==============================================================

import { useState, useEffect } from "react";
import "../index.css";

export function UserList({ socket, currentUser, incomingChallenge, onAcceptChallenge, onBack }) {
    const [users, setUsers] = useState([]);
    const [outgoingChallenge, setOutgoingChallenge] = useState(null); // Username dell'utente sfidato
    alert("socket" + socket);
    alert("currentUser" + currentUser);
    alert("incomingChallenge" + inocomingChallenge);
    alert("onAcceptChallenge" + onAcceptChallenge);
    useEffect(() => {
        if (!socket) return;

        // Richiediamo la lista utenti appena montato il componente
        socket.emit("get_users");

        // Ascoltiamo aggiornamenti sulla lista utenti (connessioni/disconnessioni)
        const handleUserListUpdate = (updatedUsers) => {
            // updatedUsers dovrebbe essere un array di oggetti { username, socketId, status }
            setUsers(updatedUsers);
        };

        socket.on("user_list_update", handleUserListUpdate);

        return () => {
            socket.off("user_list_update", handleUserListUpdate);
        };
    }, [socket]);

    const handleSendChallenge = (targetUser) => {
        setOutgoingChallenge(targetUser.username);
        socket.emit("send_challenge", { targetSocketId: targetUser.socketId });
    };

    return (
        <div className="page-wrapper">
            <div className="mode-menu" style={{ width: "500px" }}>
                <h2 className="menu-title">CHALLENGERS</h2>
                <p className="menu-subtitle">Choose an opponent</p>

                <div style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    marginBottom: "20px",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "12px",
                    padding: "10px"
                }}>
                    {users.length === 0 ? (
                        <p style={{ color: "#9ca3af" }}>No user online...</p>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #374151", textAlign: "left" }}>
                                    <th style={{ padding: "10px" }}>User</th>
                                    <th style={{ padding: "10px", textAlign: "right" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => {
                                    const isMe = u.username === currentUser;
                                    // Verifica se questo utente è colui che mi sta sfidando
                                    const isChallenger = incomingChallenge?.username === u.username;
                                    // Verifica se è l'utente che ho appena sfidato
                                    const isChallengedByMe = outgoingChallenge === u.username;

                                    return (
                                        <tr key={u.socketId} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                            <td style={{ padding: "12px 10px" }}>
                                                <span style={{ fontWeight: isMe ? "bold" : "normal", color: isMe ? "#eab308" : "white" }}>
                                                    {u.username} {isMe && "(Tu)"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 10px", textAlign: "right" }}>
                                                {isMe ? (
                                                    <span style={{ fontSize: "12px", color: "#6b7280" }}>-</span>
                                                ) : isChallenger ? (
                                                    <button className="menu-btn" style={{ padding: "6px 12px", fontSize: "12px", background: "linear-gradient(135deg, #10b981, #059669)" }} onClick={onAcceptChallenge}>
                                                        ACCEPT THE CHALLANGE
                                                    </button>
                                                ) : isChallengedByMe ? (
                                                    <span style={{ fontSize: "12px", color: "#eab308" }}>Waiting...</span>
                                                ) : (
                                                    <button
                                                        className="menu-btn"
                                                        style={{ padding: "6px 12px", fontSize: "12px", marginBottom: 0 }}
                                                        onClick={() => handleSendChallenge(u)}
                                                    >
                                                        CHALLENGE
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                <button className="back-menu-btn" onClick={onBack}>
                    ← Turn back to Menu
                </button>
            </div>
        </div>
    );
}