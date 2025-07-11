import { useState, useEffect, useRef } from "react";
import ScoreSelect from "./ScoreSelect";
import './TabScore.scss';

const TabScore = ({ scores, setScores, fixture, onProceed, onClose }) => {
  const [scorePicker, setScorePicker] = useState({ visible: false });
  const [currentTeam, setCurrentTeam] = useState("");
  const isInitialRender = useRef(true);
  const hasUserInteracted = useRef(false);

  const actions = {
    updateScore: (team) => {
      setCurrentTeam(team);
      setScorePicker({ visible: true });
      hasUserInteracted.current = true;
    },
  };

  // This effect will trigger onProceed when all scores are filled
  useEffect(() => {
    const s1 = scores.team1;
    const s2 = scores.team2;
    const isScoreSet = (value) => value !== null && value !== undefined && value !== "";

    // Only proceed automatically if this is not the initial render AND user has interacted
    if (!isInitialRender.current && hasUserInteracted.current) {
      if (s1 && s2 &&
        isScoreSet(s1.goals) && isScoreSet(s1.points) &&
        isScoreSet(s2.goals) && isScoreSet(s2.points)) {
        onProceed();
      }
    }
  }, [scores, onProceed]);

  // Mark initial render as complete after the first render
  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  const handleScoreSelectedForTeam = () => {
    setScorePicker({ visible: false }); // Close the ScoreSelect sub-dialog
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
    </div>
  );
};

export default TabScore;
