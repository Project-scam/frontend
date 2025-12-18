function EndScreen({ gameWon, gameOverReason, guessesCount, secretCode, onReset }) {
  const title = gameWon ? '💣 BOMBA 💣 DISINNESCATA! ' : '💥 ESPLOSIONE! 💥';
  const titleColor = gameWon ? '#10b981' : '#ef4444';
  const message = gameWon
    ? `In ${guessesCount} tentativi`
    : gameOverReason === 'timer'
      ? 'Tempo scaduto!'
      : 'Hai usato tutti i tentativi.';

  return (
    <div className="board-bomb" style={{ padding: '40px 36px' }}>
      <h2
        style={{
          color: titleColor,
          fontFamily: 'Orbitron',
          fontSize: '28px',
          textAlign: 'center',
          marginBottom: '20px'
        }}
      >
        {title}
      </h2>
      <p
        style={{
          color: '#eab308',
          textAlign: 'center',
          fontSize: '18px',
          marginBottom: '8px'
        }}
      >
        {message}
      </p>
      <p
        style={{
          color: '#e5e7eb',
          textAlign: 'center',
          fontSize: '14px'
        }}
      >
        Codice corretto: {secretCode.join(' - ')}
      </p>
      <button className="defuse-btn" onClick={onReset} style={{ marginTop: '24px' }}>
        NUOVA MISSIONE
      </button>
    </div>
  );
}

export default EndScreen;
