  import { useState ,useEffect } from "react";

  function EndScreen({ gameWon, gameOverReason, guessesCount, secretCode, colors, onReset }) {

    const [showSecretCode, setShowSecretCode] = useState(false)

    useEffect(() => { 
      const timer = setTimeout(() => {
        setShowSecretCode(true);
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

    const title = gameWon ? '💣 BOMBA 💣 DISINNESCATA! ' : '💥 ESPLOSIONE! 💥';
    const titleColor = gameWon ? '#10b981' : '#ef4444';
    const message = gameWon
      ? `In ${guessesCount} tentativi`
      : gameOverReason === 'timer'
        ? 'Tempo scaduto!'    
        : 'Hai usato tutti i tentativi disponibili.';

    
    const secretColors = secretCode.map(index => colors[index]);

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

        <p style={{fontFamily: 'Orbitron', color: titleColor, textAlign: 'center'}}>
          {message}
        </p>

        <div style={{
          opacity: showSecretCode ? 1 : 0,
          transition: "opacity 0.8s ease"

        }}>
          <div
            style={{
              color: '#eab308',
              textAlign: 'center',
              fontSize: '14px',
              fontFamily: 'Orbitron, monospace',
              margin: "40px 0 8px 0"
            }}
          >
            Codice segreto:
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 64px)',
              gap: '16px',
              justifyContent: 'center',
              margin: '20px 0',
              padding: '12px 0',
            }}
          >
            {secretColors.map((color, index) => (
              <div
                key={index}
                className="peg-bomb"
                style={{
                  backgroundColor: color,
                  border: '3px solid rgba(255,255,255,0.5)',
                  boxShadow:
                    '0 12px 32px rgba(0,0,0,0.6), ' +
                    '0 0 24px rgba(255,255,255,0.2) inset',
                  opacity: showSecretCode ? 1 : 0,
                  transform: showSecretCode ? "scale(1)" : "scale(0.8)",
                  transition: `opacity 0.8s ${index * 0.15}s ease-out, transform 0.8s ${index * 0.15}s ease-out` // vengono fuori uno alla volta
                }}
              />
            ))}
          </div>
        </div>

        <button className="defuse-btn" onClick={onReset} style={{ marginTop: '24px' }}>
          NUOVA MISSIONE
        </button>
      </div>
    );
  }

  export default EndScreen