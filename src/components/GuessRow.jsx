function GuessRow({ guess, feedback, isCurrent, colors, onPegClick, turnNumber, windowWidth }) {
  return (
    <div className="row-bomb">
      {turnNumber && (
        <div style={{
          minWidth: '10px',
          textAlign: 'start',
          color: isCurrent ? '#eab308' : '#9ca3af',
          fontWeight: isCurrent ? '700' : '500',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'flext-start',
          justifyContent: 'center',
          paddingRight: '8px'
        }}>
          {turnNumber}
        </div>
      )}
      <div className="guess-grid">
        {guess.map((colorIndex, j) => (
          <div
            key={j}
            className={`peg-bomb ${colorIndex === null ? 'empty' : ''}`}
            style={{
              backgroundColor:
                colorIndex !== null ? colors[colorIndex] : '',
              width: windowWidth > 900 ? '64px' : '50px',
              height: windowWidth > 900 ? '64px' : '50px',
            }}
            onClick={() => isCurrent && onPegClick(j)}
          />
        ))}
      </div>

      {feedback && (
        <div className="feedback-grid">
          {feedback.map((type, j) => (
            <div
              key={j}
              className={`feedback-peg-bomb ${type}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GuessRow;
