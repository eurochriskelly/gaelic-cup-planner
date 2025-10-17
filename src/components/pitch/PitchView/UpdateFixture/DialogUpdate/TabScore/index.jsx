import { useMemo, useState } from "react";
import ScoreSelect from "./ScoreSelect";
import './TabScore.scss';

const TabScore = ({ scores, setScores, fixture, onProceed, isSubmitting = false, onEditStart }) => {
  const [scorePicker, setScorePicker] = useState({ visible: false });
  const [currentTeam, setCurrentTeam] = useState("");

  const actions = {
    updateScore: (team) => {
      if (onEditStart && !onEditStart()) return;
      setCurrentTeam(team);
      setScorePicker({ visible: true });
    },
  };

  const handleScoreSelectedForTeam = () => {
    setScorePicker({ visible: false }); // Close the ScoreSelect sub-dialog
  };

  const isScoreValueSet = (value) => value !== null && value !== undefined && value !== "";

  const isScoreComplete = useMemo(() => (
    scores &&
    scores.team1 &&
    scores.team2 &&
    isScoreValueSet(scores.team1.goals) &&
    isScoreValueSet(scores.team1.points) &&
    isScoreValueSet(scores.team2.goals) &&
    isScoreValueSet(scores.team2.points)
  ), [scores]);

  const handleSubmitScores = () => {
    if (!onProceed || !isScoreComplete || isSubmitting) return;
    onProceed();
  };

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
    <div className="tab-score-content drawerFinish">
      <div className="score-container" style={{ position: "relative" }}>
        <div className="side-by-side">
          <TeamScore id="team1" team={fixture.team1} />
          <TeamScore id="team2" team={fixture.team2} />
        </div>
        {scorePicker.visible && (
          <div className="scoreSelectorOverlay">
            <div onClick={(e) => e.stopPropagation()}>
              <ScoreSelect
                scores={scores}
                setScores={setScores}
                currentTeam={currentTeam}
                onScoreCompleteForTeam={handleScoreSelectedForTeam}
              />
            </div>
          </div>
        )}
      </div>

      {onProceed && (
        <div className="tab-score-actions">
          <button
            type="button"
            className="set-score-button"
            disabled={!isScoreComplete || isSubmitting}
            onClick={handleSubmitScores}
          >
            {isSubmitting ? 'Saving...' : 'CONFIRM FINAL SCORE'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TabScore;
