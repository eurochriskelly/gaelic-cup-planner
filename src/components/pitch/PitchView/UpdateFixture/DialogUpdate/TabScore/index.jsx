import { useMemo, useState, useEffect } from "react";
import ScoreSelect from "./ScoreSelect";
import './TabScore.scss';

const TabScore = ({ scores, setScores, fixture, onProceed, isSubmitting = false, onEditStart }) => {
  const [scorePicker, setScorePicker] = useState({ visible: false });
  const [currentTeam, setCurrentTeam] = useState("");
  const [isExtraTime, setIsExtraTime] = useState(false);
  const [isPenalties, setIsPenalties] = useState(false);

  // Determine field names based on mode
  const goalField = isPenalties ? 'goalsPenalties' : isExtraTime ? 'goalsExtra' : 'goals';
  const pointField = isPenalties ? 'pointsPenalties' : isExtraTime ? 'pointsExtra' : 'points';

  const actions = {
    updateScore: (team) => {
      if (onEditStart && !onEditStart()) return;
      setCurrentTeam(team);
      setScorePicker({ visible: true });
    },
  };

  const handleScoreSelectedForTeam = () => {
    // In penalties mode, automatically set points to 0 for the current team
    if (isPenalties && currentTeam) {
      setScores(prevScores => ({
        ...prevScores,
        [currentTeam]: {
          ...prevScores[currentTeam],
          pointsPenalties: 0
        }
      }));
    }
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

    // If penalties mode is active, only penalties goals must be complete
    if (isPenalties) {
      return isScoreValueSet(scores.team1.goalsPenalties) &&
        isScoreValueSet(scores.team2.goalsPenalties);
    }

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

  // Check if we should show the penalties toggle
  // Only show when extra time is enabled AND complete AND totals are still equal
  const shouldShowPenalties = useMemo(() => {
    if (!isExtraTime) return false;

    // Check if extra time scores are complete
    const extraTimeComplete = scores &&
      scores.team1 &&
      scores.team2 &&
      isScoreValueSet(scores.team1.goalsExtra) &&
      isScoreValueSet(scores.team1.pointsExtra) &&
      isScoreValueSet(scores.team2.goalsExtra) &&
      isScoreValueSet(scores.team2.pointsExtra);

    if (!extraTimeComplete) return false;

    // Calculate totals including extra time: (goals * 3) + points
    const goals1Total = Number(scores.team1.goals) + Number(scores.team1.goalsExtra);
    const points1Total = Number(scores.team1.points) + Number(scores.team1.pointsExtra);
    const goals2Total = Number(scores.team2.goals) + Number(scores.team2.goalsExtra);
    const points2Total = Number(scores.team2.points) + Number(scores.team2.pointsExtra);

    const total1 = (goals1Total * 3) + points1Total;
    const total2 = (goals2Total * 3) + points2Total;

    return total1 === total2;
  }, [scores, isExtraTime]);

  // Auto-disable extra time if scores change and are no longer tied
  useEffect(() => {
    if (isExtraTime && !shouldShowExtraTime) {
      setIsExtraTime(false);
    }
  }, [shouldShowExtraTime, isExtraTime]);

  // Auto-disable penalties if extra time unchecked or scores no longer tied
  useEffect(() => {
    if (isPenalties && (!isExtraTime || !shouldShowPenalties)) {
      setIsPenalties(false);
    }
  }, [isPenalties, isExtraTime, shouldShowPenalties]);

  const displayScore = (team, type) => {
    const ozp = (n) => `00${n}`.slice(-2);
    const goals = scores[team][goalField];
    const points = scores[team][pointField];
    const isScoreSet = (value) => value !== null && value !== undefined && value !== "";

    let showScore = '';
    switch (type) {
      case 'points':
        // In penalties mode, always show 00 for points (penalties are goals only)
        if (isPenalties) {
          showScore = '00';
        } else {
          showScore = isScoreSet(points) ? ozp(points) : '##';
        }
        break;
      case 'goals':
        showScore = isScoreSet(goals) ? `${goals}` : '#';
        break;
      case 'total':
        if (isPenalties) {
          // In penalties mode, total is just the goals value
          showScore = isScoreSet(goals) ? ozp(goals) : '##';
        } else {
          showScore = isScoreSet(goals) && isScoreSet(points) ? ozp((goals * 3) + points) : '##';
        }
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

      <div className="extra-time-toggle penalties-toggle">
        <label className={`extra-time-label ${!shouldShowPenalties ? 'disabled' : ''}`}>
          <input
            type="checkbox"
            checked={isPenalties}
            disabled={!shouldShowPenalties}
            onChange={(e) => setIsPenalties(e.target.checked)}
          />
          <span>Penalties</span>
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
                isPenalties={isPenalties}
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
