import { useState } from "react";
import ScoreSelect from "./ScoreSelect";
import './TabScore.scss';

const TabScore = ({ fixture, onProceed, onClose }) => {
  const [scores, setScores] = useState({
    team1: { goals: fixture.goals1 ?? "", points: fixture.points1 ?? "", name: fixture.team1 },
    team2: { goals: fixture.goals2 ?? "", points: fixture.points2 ?? "", name: fixture.team2 },
  });
  const [scorePicker, setScorePicker] = useState({ visible: false });
  const [currentTeam, setCurrentTeam] = useState("");

  const actions = {
    updateScore: (team) => {
      setCurrentTeam(team);
      setScorePicker({ visible: true });
    },
    saveScore: () => {
      onProceed(scores);
      onClose();
    },
    cancel: () => onClose(),
  };

  const scoresNotReady = () => !(scores.team1.goals !== "" && scores.team1.points !== "" && scores.team2.goals !== "" && scores.team2.points !== "");

  const displayScore = (team, type) => {
    const score = scores[team][type];
    const ozp = (n) => `00${n}`.slice(-2);
    const goals = scores[team].goals;
    const points = scores[team].points;
    const isScoreSet = (value) => value !== null && value !== undefined && value !== "";

    let showScore = '';
    switch (type) {
      case 'points':
        showScore = isScoreSet(points) ? ozp(points) : '##';
        break;
      case 'goals':
        showScore = isScoreSet(goals) ? `${goals}` : '#';
        break;
      case 'total':
        showScore = isScoreSet(goals) && isScoreSet(points) ? ozp((goals * 3) + points) : '##';
        break;
      default:
        showScore = '??';
        break;
    }
    return showScore;
  };

  const TeamScore = ({ id, team }) => {
    let showGoals = displayScore(id, 'goals');
    let showPoints = displayScore(id, 'points');
    let showTotal = displayScore(id, 'total');
    const concat = `${showTotal}${showPoints}${showGoals}`;
    const match = concat.match(/#/g);
    if ((match || []).length === 5) {
      showGoals = <span className="grayed-score">#</span>;
      showPoints = <span className="grayed-score">##</span>;
      showTotal = <span className="grayed-score">##</span>;
    } else {
      showPoints = <span>{showPoints.replace(/#/g, '0')}</span>;
      showTotal = <span>{showTotal.replace(/#/g, '0')}</span>;
    }
    return (
      <div className="teamScore" onClick={() => actions.updateScore(id)}>
        <h4>{team}</h4>
        <div>
          <div>{showGoals}</div>
          <div> - </div>
          <div>{showPoints}</div>
          <div>
            <span>(</span>
            <span>{showTotal}</span>
            <span>)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="drawerFinish">
      <div className="drawer-header">Set Score</div>
      <div className="drawer-container" style={{ position: "relative" }}>
        <div>
          <TeamScore id="team1" team={fixture.team1} />
          <TeamScore id="team2" team={fixture.team2} />
          <div className="proceedButtons">
            <button
              disabled={scoresNotReady()}
              className={scoresNotReady() ? "disabled" : "enabled"}
              onClick={actions.saveScore}
            >
              Proceed
            </button>
            <button onClick={actions.cancel}>Cancel</button>
          </div>
        </div>
        {scorePicker.visible && (
          <div className="scoreSelector">
            <ScoreSelect
              scores={scores}
              currentTeam={currentTeam}
              updateScore={(newScore) => {
                setScores({ ...scores, [currentTeam]: newScore });
                setScorePicker({ visible: false });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabScore;
