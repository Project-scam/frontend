import ProfileUser from "./ProfileUser/ProfileUser";

function BombHeader({ minutes, seconds, guessesCount, maxTurns, mode, hideAttempts }) {
  const currentTurn = Math.min(guessesCount + 1, maxTurns);
  const progress = (currentTurn / maxTurns) * 100;

  return (
    <div className="header-bomb">
      <ProfileUser />
      <div className="badge-scam">MASTERMIND SCAM</div>
      <h1 className="title">DEFUSE THE BOMB</h1>

      {mode === 'devil' && (
        <div className="timer-bomb">
          {minutes}:{seconds}
        </div>
      )}

      {mode === 'normal' && (
        <div className="timer-bomb" style={{ opacity: 0.4, fontSize: '18px' }}>
         Single Player
        </div>
      )}

      {!hideAttempts && (
       <div className="urgency-meter">
         Attempts: {currentTurn}/{maxTurns}
          <div className="meter-bar">
           <div className="meter-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>     
      )}


    </div>
  );
}

export default BombHeader;
