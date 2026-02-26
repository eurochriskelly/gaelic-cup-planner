import { useEffect, useMemo, useState } from "react";
import API from "../../../../../../shared/api/endpoints";
import './TabCancel.scss';

const optionMeta = {
  team1_forfeit: {
    id: 'team1_forfeit',
    title: 'Team 1 Forfeit',
    subtitle: 'Team 2 gets the walkover',
  },
  team2_forfeit: {
    id: 'team2_forfeit',
    title: 'Team 2 Forfeit',
    subtitle: 'Team 1 gets the walkover',
  },
  draw: {
    id: 'draw',
    title: 'Mutual Draw',
    subtitle: 'No forfeit or walkover',
  },
}

const TabCancel = ({
  cancellationOption,
  setCancellationOption,
  onConfirm,
  team1,
  team2,
  fixture
}) => {
  const [confirming, setConfirming] = useState(false);

  const selectedMeta = useMemo(
    () => optionMeta[cancellationOption] || null,
    [cancellationOption]
  );

  const handleConfirm = (type) => {
    setCancellationOption(type);
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

    if (cancellationOption === 'team1_forfeit') {
      result.scores.team2.points = 1;
    } else if (cancellationOption === 'team2_forfeit') {
      result.scores.team1.points = 1;
    }

    if (!fixture.started) {
      await API.startMatch(fixture.tournamentId, fixture.id);
    }

    await API.updateScore(fixture.tournamentId, fixture.id, result)
      .then(() => {
        setConfirming(false);
        onConfirm && onConfirm();
      })
      .catch((error) => {
        console.error("Error updating match outcome:", error);
        setConfirming(false);
      });

    if (!fixture.ended) {
      await API.endMatch(fixture.tournamentId, fixture.id);
    }
  };

  const cancelConfirmation = () => {
    setConfirming(false);
  };

  useEffect(() => {
    if (!cancellationOption) {
      setConfirming(false);
    }
  }, [cancellationOption]);

  return (
    <div className="drawerCancel">
      <div className="cancelForm">
        {confirming ? (
          <div className="confirm-view">
            <h3>Confirm Not Played Outcome</h3>
            <p className="confirm-subtitle">{selectedMeta?.title}</p>
            <OutcomeMatrix option={cancellationOption} team1={team1} team2={team2} />
            <div className="confirm-actions">
              <button className="btn-no" onClick={cancelConfirmation}>No, go back</button>
              <button className="btn-yes" onClick={handleFinalConfirm}>Yes, confirm</button>
            </div>
          </div>
        ) : (
          <div className="options-view">
            <h3>Mark Match As Not Played</h3>
            <p className="options-subtitle">Pick one outcome below</p>
            <div className="outcome-options-grid">
              <OutcomeOption
                option="team1_forfeit"
                title={optionMeta.team1_forfeit.title}
                subtitle={optionMeta.team1_forfeit.subtitle}
                team1={team1}
                team2={team2}
                onClick={handleConfirm}
              />

              <OutcomeOption
                option="team2_forfeit"
                title={optionMeta.team2_forfeit.title}
                subtitle={optionMeta.team2_forfeit.subtitle}
                team1={team1}
                team2={team2}
                onClick={handleConfirm}
              />
            </div>

            <button className="draw-option" onClick={() => handleConfirm('draw')}>
              <span className="draw-title">Teams Agree Draw</span>
              <span className="draw-teams">{team1} vs {team2}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function OutcomeOption({ option, title, subtitle, team1, team2, onClick }) {
  const team1Status = option === 'team1_forfeit' ? 'forfeit' : 'walkover';
  const team2Status = option === 'team2_forfeit' ? 'forfeit' : 'walkover';

  return (
    <button className="outcome-option" onClick={() => onClick(option)}>
      <div className="option-header">
        <span className="option-title">{title}</span>
        <span className="option-subtitle">{subtitle}</span>
      </div>
      <OutcomeRow team={team1} status={team1Status} />
      <OutcomeRow team={team2} status={team2Status} />
    </button>
  );
}

function OutcomeMatrix({ option, team1, team2 }) {
  if (option === 'draw') {
    return (
      <div className="outcome-matrix draw">
        <div className="outcome-row draw-row">
          <span className="team">{team1}</span>
          <span className="status-badge draw">DRAW</span>
        </div>
        <div className="outcome-row draw-row">
          <span className="team">{team2}</span>
          <span className="status-badge draw">DRAW</span>
        </div>
      </div>
    );
  }

  const team1Status = option === 'team1_forfeit' ? 'forfeit' : 'walkover';
  const team2Status = option === 'team2_forfeit' ? 'forfeit' : 'walkover';

  return (
    <div className="outcome-matrix">
      <OutcomeRow team={team1} status={team1Status} />
      <OutcomeRow team={team2} status={team2Status} />
    </div>
  );
}

function OutcomeRow({ team, status }) {
  return (
    <div className="outcome-row">
      <span className="team">{team}</span>
      <span className={`status-badge ${status}`}>
        {status.toUpperCase()}
      </span>
    </div>
  );
}

export default TabCancel;
