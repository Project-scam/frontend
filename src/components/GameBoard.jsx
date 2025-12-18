import GuessRow from './GuessRow';
import ColorPicker from './ColorPicker';

function GameBoard({
  guesses,
  currentGuess,
  colors,
  canPlay,
  onPegClick,
  selectedColor,
  onSelectColor,
  mainButtonLabel,
  mainButtonDisabled,
  mainButtonOnClick,
}) {
  if (!canPlay && guesses.length === 0) return null;

  return (
    <>
      <div className="board-bomb">
        {guesses.map((g, i) => (
          <GuessRow
            key={i}
            guess={g.guess}
            feedback={g.feedback}
            isCurrent={false}
            colors={colors}
            onPegClick={() => {}}
          />
        ))}

        {canPlay && (
          <GuessRow
            guess={currentGuess}
            feedback={null}
            isCurrent
            colors={colors}
            onPegClick={onPegClick}
          />
        )}
      </div>

      {canPlay && (
        <>
          <ColorPicker
            colors={colors}
            selectedColor={selectedColor}
            onSelect={onSelectColor}
          />
          <button
            className="defuse-btn"
            onClick={mainButtonOnClick}
            disabled={mainButtonDisabled}
          >
            {mainButtonLabel}
          </button>
        </>
      )}
    </>
  );
}

export default GameBoard;
