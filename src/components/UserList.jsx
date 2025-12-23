//=========================================================
// File: UserList.jsx
// Lista utenti online (loggati) da sfidare.
// @authors: "catalin.groppo@allievi.itsdigitalacademy.com"
//           "sandu.batrincea@allievi.itsdigitalacademy.com"
//           "mattia.zara@allievi.itsdigitalacademy.com"
//           "andrea.vilari@allievi.itsdigitalacademy.com"
//===========================================================

import React, { useState, useEffect } from "react";
import { API_URLS } from "../config.js";
import "../index.css"

export const UserList = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Nessun token trovato. Effettua il login.");

                const response = await fetch(API_URLS.USER_LIST, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Invio il Token JWT nell'header
                    }
                });

                if (!response.ok) {
                    throw new Error("Errore nel recupero della lista utenti.");
                }

                const data = await response.json();
                // Assicuriamoci che data sia un array
                setUsers(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="page-wrapper">
            <div className="mode-menu" style={{ width: "90%", maxWidth: "500px" }}>
                <h1 className="menu-title">CHALLENGERS</h1>

                {loading && <p style={{ color: "#eab308" }}>Loading...</p>}
                {error && <p style={{ color: "#ef4444" }}>{error}</p>}

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "20px 0", maxHeight: "400px", overflowY: "auto" }}>
                    {users.map((user) => (
                        <div key={user.id} className="leaderboard-card" style={{ width: "100%", margin: 0, height: "auto", color: "white", borderColor: "rgba(255,255,255,0.2)" }}>
                            <div style={{ textAlign: "left" }}>
                                <div style={{ fontWeight: "bold" }}>{user.username}</div>
                                <div style={{ fontSize: "12px", color: user.stato === 'L' ? "#10b981" : "#6b7280" }}>
                                    {user.stato === 'L' ? "● Online" : "○ Offline"}
                                </div>
                            </div>
                            <button className="menu-btn" style={{ width: "auto", padding: "8px 16px", fontSize: "12px", color: "black", marginBottom: 0 }}>CHALLENGE</button>
                        </div>
                    ))}
                </div>

                <button className="back-menu-btn" onClick={onBack}>
                    ← Turn back to Menu
                </button>
            </div>
        </div>
    )
}