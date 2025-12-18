import React from "react";

export default function Leaderboard() {
  const utenti = {
    1: { nome: "Mario", punteggio: "27" },
    2: { nome: "Marco", punteggio: "45" },
    3: { nome: "Mercurio", punteggio: "11" },
    4: { nome: "Michele", punteggio: "389" },
    5: { nome: "Franco", punteggio: "5" },
    6: { nome: "Fiona", punteggio: "99" },
  };
  const lista = Object.values(utenti);
  console.log(lista);

  return (
    <div className="page">
      <ol>
        {lista.map((e, index) => {
          return (
            <>
              <li className="leaderboard-card">
                <p>{index}</p> <p>{e.nome}</p> <p>{e.punteggio}</p>
              </li>
            </>
          );
        })}
      </ol>
      <button>Statistiche</button>
      <button>Chiudi</button>
    </div>
  );
}
