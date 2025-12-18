function GuessRow({ guess, feedback, isCurrent, colors, onPegClick }) {
  return (
    <div className="row-bomb">
      <div className="guess-grid">
        {guess.map((colorIndex, j) => (
          <div
            key={j}
            className={`peg-bomb ${colorIndex === null ? 'empty' : ''}`}
            style={{
              backgroundColor:
                colorIndex !== null ? colors[colorIndex] : ''
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
