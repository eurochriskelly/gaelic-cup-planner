import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../../../shared/api/endpoints";
import ScoreSelect from "./ScoreSelect";
import ListCardedPlayers from "./ListCardedPlayers";
import './DrawerFinish.scss';

const DrawerFinish = ({
  fixture,
  visible,
  updateFixtures,
  initialStep = 0,
  onConfirm = () => {},
  onClose = () => {},
}) => {
  if (!visible) return null;

  const { tournamentId } = useParams();

  const steps = ["score", "cardedPlayers"];
  // create a state object to store the current step and the current task
  const [currentTeam, setCurrentTeam] = useState("");
  const [currentType, setCurrentType] = useState("");
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [scores, setScores] = useState({
    team1: {
      goals: "",
      points: "",
      name: fixture.team1,
      category: fixture.category,
    },
    team2: {
      goals: "",
      points: "",
      name: fixture.team2,
      category: fixture.category,
    },
  });
  const [scorePicker, setScorePicker] = useState({ visible: false });

  const drawerStepStyle = (step) => {
    return {
      display: steps[currentStep] === step ? "block" : "none",
    };
  };

  const actions = {
    saveScore: async () => {
      onConfirm();
      await API.updateScore(tournamentId, fixture.id, scores);
      setCurrentStep(1);
    },
    notReadyToSaveScore: () => {
      setCurrentStep(0);
      onClose();
    },
    cardPlayersUpdated: async (players) => {
      if (players.length) {
        await API.updateCardedPlayers(tournamentId, fixture.id, players);
      }
      setCurrentStep(0);
      updateFixtures();
      onClose();
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
  const displayScore = (team, type = 'total') => {
      const score = scores[team][type];
      const ozp = n => `##${n}`.slice(-2); // Pads to 2 digits
      const goals = scores[team].goals;
      const points = scores[team].points;
      let showScore = ''
      switch (type) {
        case 'points':
          showScore = points || points === 0 ? ozp(points) : '##';
          break;
        case 'goals':
          showScore = goals || goals === 0 ? `${goals}` : '#';
          break;
        case 'total':
          showScore = (goals || goals === 0) && (points || points === 0)
            ? ozp((goals * 3) + points)
            : '##';
          break;
        default:
          showScore = '??';
          break;
      }
      return showScore
  }

  const TeamScore = ({ id, team }) => {
    let showGoals  = displayScore(id, 'goals');
    let showPoints = displayScore(id, 'points');
    let showTotal  = displayScore(id, 'total');
    const concat = `${showTotal}${showPoints}${showGoals}`
    const match = concat.match(/#/g)
    if ((match||[]).length === 5) {
      showGoals  = <span className="grayed-score">#</span>
      showPoints = <span className="grayed-score">##</span>
      showTotal  = <span className="grayed-score">##</span>
    } else {
      showPoints = <span>{showPoints.replace(/#/g, '0')}</span>;
      showTotal = <span>{showTotal.replace(/#/g, '0')}</span>;
    }
    return (
      <div className="teamScore">
        <h4>{team}</h4>
        <div>
          <div onClick={actions.updateScore.bind(null, id, "goals")}>
            {showGoals}
          </div>
          <div>&nbsp;-&nbsp;</div>
          <div onClick={actions.updateScore.bind(null, id, "points")}>
            {showPoints}
          </div>
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
    <div className="drawer drawerFinish">
      <div className="drawerStep" style={drawerStepStyle("score")}>
        <div className="drawer-header">Update match score</div>
        <div className="drawer-container" style={{ position: "relative" }}>
          <div>
            <TeamScore id='team1' team={team1} />
            <TeamScore id='team2' team={team2} />
            <div className="proceedButtons">
              <button
                disabled={scoresNotReady()}
                className={scoresNotReady() ? "disabled" : "enabled"}
                onClick={actions.saveScore}
              >
                Proceed
              </button>
              <button className="text-4xl" onClick={actions.notReadyToSaveScore}>Cancel</button>
            </div>
          </div>
          {scorePicker.visible && (
            <div className="scoreSelector">
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

      <div className="drawerStep" style={drawerStepStyle("cardedPlayers")}>
        <div className="drawer-header">List carded players</div>
        <div className="drawer-container">
            <ListCardedPlayers
              team1={fixture.team1}
              team2={fixture.team2}
              onProceed={actions.cardPlayersUpdated}
              onClose={onClose} // Pass onClose
            />
        </div>
      </div>
    </div>
  );
};

export default DrawerFinish;
