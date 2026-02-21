import { useMemo, useState, useEffect } from "react";
import ScoreSelect from "./ScoreSelect";
import './TabScore.scss';

const TabScore = ({ scores, setScores, fixture, onProceed, isSubmitting = false, onEditStart }) => {
  const [scorePicker, setScorePicker] = useState({ visible: false });
  const [currentTeam, setCurrentTeam] = useState("");
  const [isExtraTime, setIsExtraTime] = useState(false);

  // Determine field names based on mode
  const goalField = isExtraTime ? 'goalsExtra' : 'goals';
  const pointField = isExtraTime ? 'pointsExtra' : 'points';

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

  // Normal time scores must always be complete
  // Extra time scores only need to be complete if extra time mode is active
  const isScoreComplete = useMemo(() => {
    const normalComplete = scores &&
      scores.team1 &&
      scores.team2 &&
      isScoreValueSet(scores.team1.goals) &&
      isScoreValueSet(scores.team1.points) &&
      isScoreValueSet(scores.team2.goals) &&
      isScoreValueSet(scores.team2.points);

    if (!normalComplete) return false;

    // If extra time mode is active, extra time scores must also be complete
    if (isExtraTime) {
      return isScoreValueSet(scores.team1.goalsExtra) &&
        isScoreValueSet(scores.team1.pointsExtra) &&
        isScoreValueSet(scores.team2.goalsExtra) &&
        isScoreValueSet(scores.team2.pointsExtra);
    }

    return true;
  }, [scores, isExtraTime]);

  const handleSubmitScores = () => {
    if (!onProceed || !isScoreComplete || isSubmitting) return;
    onProceed();
  };

  // Check if we should show the extra time toggle
  // Only show when both scores are set AND totals are equal (draw)
  const shouldShowExtraTime = useMemo(() => {
    // First check if normal scores are complete
    const normalComplete = scores &&
      scores.team1 &&
      scores.team2 &&
      isScoreValueSet(scores.team1.goals) &&
      isScoreValueSet(scores.team1.points) &&
      isScoreValueSet(scores.team2.goals) &&
      isScoreValueSet(scores.team2.points);

    if (!normalComplete) return false;

    // Calculate totals: (goals * 3) + points
    const total1 = (Number(scores.team1.goals) * 3) + Number(scores.team1.points);
    const total2 = (Number(scores.team2.goals) * 3) + Number(scores.team2.points);

    return total1 === total2;
  }, [scores]);

  // Auto-disable extra time if scores change and are no longer tied
  useEffect(() => {
    if (isExtraTime && !shouldShowExtraTime) {
      setIsExtraTime(false);
    }
  }, [shouldShowExtraTime, isExtraTime]);

  const displayScore = (team, type) => {
    const ozp = (n) => `00${n}`.slice(-2);
    const goals = scores[team][goalField];
    const points = scores[team][pointField];
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
      <div className="extra-time-toggle">
        <label className={`extra-time-label ${!shouldShowExtraTime ? 'disabled' : ''}`}>
          <input
            type="checkbox"
            checked={isExtraTime}
            disabled={!shouldShowExtraTime}
            onChange={(e) => setIsExtraTime(e.target.checked)}
          />
          <span>Extra Time</span>
        </label>
      </div>

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
                goalField={goalField}
                pointField={pointField}
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
