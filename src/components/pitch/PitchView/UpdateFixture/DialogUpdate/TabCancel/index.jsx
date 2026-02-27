import { useState } from "react";
import API from "../../../../../../shared/api/endpoints";
import '../../../../../../components/web/logo-box';
import './TabCancel.scss';

const TabCancel = ({
  onConfirm,
  team1,
  team2,
  fixture
}) => {
  const [confirming, setConfirming] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (type) => {
    setSelectedOption(type);
    setConfirming(true);
  };

  const handleFinalConfirm = async () => {
    const result = {
      scores: {
        team1: { goals: 0, points: 0 },
        team2: { goals: 0, points: 0 }
      },
      outcome: "skipped",
    };

    if (selectedOption === 'team1_forfeit') {
      result.scores.team2.points = 1;
    } else if (selectedOption === 'team2_forfeit') {
      result.scores.team1.points = 1;
    }

    try {
      if (!fixture.started) {
        await API.startMatch(fixture.tournamentId, fixture.id);
      }

      await API.updateScore(fixture.tournamentId, fixture.id, result);

      if (!fixture.ended) {
        await API.endMatch(fixture.tournamentId, fixture.id);
      }

      setConfirming(false);
      onConfirm && onConfirm();
    } catch (error) {
      console.error("Error updating match outcome:", error);
      setConfirming(false);
    }
  };

  const cancelConfirmation = () => {
    setConfirming(false);
    setSelectedOption(null);
  };

  if (confirming) {
    const confirmText = selectedOption === 'draw' 
      ? 'Mark match as a draw?' 
      : selectedOption === 'team1_forfeit' 
      ? `${team1} forfeits?`
      : `${team2} forfeits?`;

    return (
      <div className="drawerCancel">
        <div className="cancelForm">
          <div className="confirm-view">
            <h3>{confirmText}</h3>
            <div className="confirm-actions">
              <button className="btn-no" onClick={cancelConfirmation}>Cancel</button>
              <button className="btn-yes" onClick={handleFinalConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="drawerCancel">
      <div className="cancelForm">
        <div className="options-view">
          <h3 className="title">Select team to FORFEIT</h3>
          
          <div className="teams-grid">
            <button 
              className="team-tile" 
              onClick={() => handleSelect('team1_forfeit')}
            >
              <logo-box title={team1} size="100px" border-color="#e11d48"></logo-box>
              <span className="team-name">{team1}</span>
            </button>
            
            <button 
              className="team-tile" 
              onClick={() => handleSelect('team2_forfeit')}
            >
              <logo-box title={team2} size="100px" border-color="#38bdf8"></logo-box>
              <span className="team-name">{team2}</span>
            </button>
          </div>
          
          <div className="or-divider">OR</div>
          
          <button className="draw-button" onClick={() => handleSelect('draw')}>
            Teams Agree Draw
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabCancel;
