import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export function Leaderboard({ onClose }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/ranking`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Errore nel caricamento della classifica");
        }

        const data = await response.json();
        setRanking(data);
      } catch (err) {
        console.error("Errore fetch ranking:", err);
        setError("Impossibile caricare la classifica.");
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="mode-menu" style={{ width: "500px", maxHeight: "80vh" }}>
        <h2 className="menu-title">TOP PLAYERS</h2>

        {loading ? (
          <p style={{ color: "white", textAlign: "center" }}>Loading...</p>
        ) : error ? (
          <p style={{ color: "#ef4444", textAlign: "center" }}>{error}</p>
        ) : (
          <div
            style={{
              overflowY: "auto",
              maxHeight: "400px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "12px",
              padding: "10px",
              marginBottom: "20px",
              width: "100%"
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #374151", textAlign: "left" }}>
                  <th style={{ padding: "10px", width: "50px" }}>#</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Users</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Scores</th>
                </tr>
              </thead>
              <tbody>
                {ranking.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: "20px", textAlign: "center", color: "#a9b0bdff" }}>
                      No score.
                    </td>
                  </tr>
                ) : (
                  ranking.map((user, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px 10px", fontWeight: "bold", color: index < 3 ? "#eab308" : "white" }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: "12px 10px" }}>{user.username}</td>
                      <td style={{ padding: "12px 10px", textAlign: "right", fontFamily: "monospace", fontSize: "1.1em" }}>
                        {user.punti}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <button className="back-menu-btn" onClick={onClose}>
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}
