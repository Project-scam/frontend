import ColorPicker from './ColorPicker';

function VersusSetup({
  tempCode,
  colors,
  selectedColor,
  onSelectColor,
  onSetCodePeg,
  onConfirm,
  onBack,
}) {
  return (
    <div className="page-wrapper">
      <div className="bomb-container">
        <div className="setup-header">
          <h2 className="setup-title">Giocatore 1: imposta il codice segreto</h2>
          <p className="setup-subtitle">
            Scegli 4 colori. Il Giocatore 2 dovrà indovinarli.
          </p>
        </div>

        <div className="board-bomb">
          <div className="row-bomb">
            <div className="guess-grid">
              {tempCode.map((colorIndex, j) => (
                <div
                  key={j}
                  className={`peg-bomb ${colorIndex === null ? 'empty' : ''}`}
                  style={{
                    backgroundColor:
                      colorIndex !== null ? colors[colorIndex] : ''
                  }}
                  onClick={() => onSetCodePeg(j)}
                />
              ))}
            </div>
          </div>
        </div>

        <ColorPicker
          colors={colors}
          selectedColor={selectedColor}
          onSelect={onSelectColor}
        />

        <button
          className="defuse-btn"
          onClick={onConfirm}
          disabled={!tempCode.every(c => c !== null)}
        >
          Conferma Codice per P2
        </button>

        <div style={{ padding: '12px 16px' }}>
          <button
            className="back-menu-btn"
            onClick={onBack}
          >
            ← Torna alla scelta modalità
          </button>
        </div>
      </div>
    </div>
  );
}

export default VersusSetup;
