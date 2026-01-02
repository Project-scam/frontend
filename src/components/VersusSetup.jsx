import ColorPicker from './ColorPicker';
import { useState } from "react";
import Modal from "./Modal/Modal";

function VersusSetup({
  tempCode,
  colors,
  selectedColor,
  onSelectColor,
  onSetCodePeg,
  onConfirm,
  onBack,
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    textColor: "black",
    textColorSubtitle: "black"
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setModalConfig({
      title: "",
      message: "",
      textColor: "black",
      textColorSubtitle: "black"
    });
  };

  return (
    <div className="page-wrapper">
      <div className="bomb-container">
        <div className="setup-header">
          <h2 className="setup-title">  Player 1: Set the secret code </h2>
          <p className="setup-subtitle">
            Choose 4 colors. Player 2 will have to guess them.
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
          onClick={() => {
            const result = onConfirm();
            if (typeof result === "string") {
              setModalConfig({
                title: "Error",
                message: result,
                textColor: "red",
                textColorSubtitle: "black",
              });
              setShowModal(true);
            }
          }}
          disabled={!tempCode.every(c => c !== null)}
        >
         Confirm code for P2
        </button>

        <div style={{ padding: '12px 16px' }}>
          <button
            className="back-menu-btn"
            onClick={onBack}
          >
            ← Back to mode selection
          </button>
        </div>

        {showModal && (
          <Modal
            onClose={handleCloseModal}
            title={modalConfig.title}
            subtitle={modalConfig.message}
            textColor={modalConfig.textColor}
            textColorSubtitle={modalConfig.textColorSubtitle}
          />
        )}
      </div>
    </div>
  );
}

export default VersusSetup;
