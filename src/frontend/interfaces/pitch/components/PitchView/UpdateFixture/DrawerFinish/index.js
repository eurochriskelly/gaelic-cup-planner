import React, { useState } from "react";
import API from "../../../../../../shared/api/pitch";
import ScoreSelect from "./ScoreSelect";
import ListCardedPlayers from "./ListCardedPlayers";

const DrawerFinish = ({
  fixture,
  visible,
  updateFixtures,
  initialStep = 0,
  onConfirm = () => {},
  onClose = () => {},
}) => {
  if (!visible) return null;
  const steps = ["score", "cardedPlayers"];
  // create a state object to store the current step and the current task
  const [currentTeam, setCurrentTeam] = useState("");
  const [currentType, setCurrentType] = useState("");
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [scores, setScores] = useState({
    team1: { goals: "", points: "", name: fixture.team1, category: fixture.category },
    team2: { goals: "", points: "", name: fixture.team2, category: fixture.category },
  });
  const [scorePicker, setScorePicker] = useState({ visible: false });

  const drawerStepStyle = (step) => {
    return {
      display: steps[currentStep] === step ? "block" : "none",
    };
  }

  const actions = {
    saveScore: async () => {
      onConfirm();
      await API.updateScore(fixture.id, scores);
      setCurrentStep(1);
    },
    notReadyToSaveScore: () => {
      setCurrentStep(0);
      onClose()
    },
    cardPlayersUpdated: async (players) => {
      if (players.length) {
        await API.updateCardedPlayers(fixture.id, players);
      }
      setCurrentStep(0);
      updateFixtures();
      onClose()
    },
    updateScore: (team, type, amount) => {
      setCurrentTeam(team);
      setCurrentType(type);
      setScorePicker({ visible: true });
    },
  };

  const scoresNotReady = () => {
    return !(
      scores.team1.goals !== "" &&
      scores.team1.points !== "" &&
      scores.team2.goals !== "" &&
      scores.team2.points !== ""
    );
  };

  const { team1, team2 } = fixture;
  const displayScore = (team, type) => {
    const score = scores[team][type];
    return score || score === 0 ? score : "?";
  };
  return (
    <div className='drawerFinish'>
      <div className='drawerStep' style={drawerStepStyle('score')}>
        <div className="drawer-header">Update match score</div>
        <div className="drawer-container" style={{ position: "relative" }}>
          <div>
            <div className='teamScore'>
              <h4>{team1}</h4>
              <div>
                <div onClick={actions.updateScore.bind(null, "team1", "goals")}>
                  {displayScore("team1", "goals")}
                </div>
                <div
                  onClick={actions.updateScore.bind(null, "team1", "points")}
                >
                  {displayScore("team1", "points")}
                </div>
              </div>
            </div>
            <div className='teamScore'>
              <h4>{team2}</h4>
              <div>
                <div onClick={actions.updateScore.bind(null, "team2", "goals")}>
                  {displayScore("team2", "goals")}
                </div>
                <div
                  onClick={actions.updateScore.bind(null, "team2", "points")}
                >
                  {displayScore("team2", "points")}
                </div>
              </div>
            </div>
            <div className='proceedButtons'>
              <button
                disabled={scoresNotReady()}
                className={scoresNotReady() ? "disabled" : "enabled"}
                onClick={actions.saveScore}
              >
                Proceed
              </button>
              <button onClick={actions.notReadyToSaveScore}>Cancel</button>
            </div>
          </div>
          {scorePicker.visible && (
            <div className='scoreSelector'>
              <ScoreSelect
                scores={scores}
                currentTeam={currentTeam}
                updateScore={(a) => {
                  setScores({ ...scores, [currentTeam]: a });
                  setTimeout(() => {
                    setScorePicker({ visible: false });
                  }, 500);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className='drawerStep' style={drawerStepStyle('cardedPlayers')}>
        <div className="drawer-header">List carded players</div>
        <div className="drawer-container">
          <ListCardedPlayers team1={fixture.team1} team2={fixture.team2} onProceed={actions.cardPlayersUpdated} />
        </div>
      </div>
    </div>
  );
};

export default DrawerFinish;
