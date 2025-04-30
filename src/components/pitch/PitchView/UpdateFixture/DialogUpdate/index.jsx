import { useState, useEffect } from "react";
import TabScore from "./TabScore";
import TabCards from "./TabCards";
import TabCancel from "./TabCancel";
import API from "../../../../../shared/api/endpoints"; // Import API
import './DialogUpdate.scss';

const DialogUpdate = ({ fixture, onClose }) => {
  const [currentTab, setCurrentTab] = useState("score");

  // State for all tabs, initialized with fixture data
  const [scores, setScores] = useState({
    team1: { goals: fixture.goals1 ?? "", points: fixture.points1 ?? "", name: fixture.team1 },
    team2: { goals: fixture.goals2 ?? "", points: fixture.points2 ?? "", name: fixture.team2 },
  });
  const [cardedPlayers, setCardedPlayers] = useState({
    team1: [],
    team2: [],
  });
  const [cancellationOption, setCancellationOption] = useState(null);

  const scoresNotReady = () => !(scores.team1.goals !== "" && scores.team1.points !== "" && scores.team2.goals !== "" && scores.team2.points !== "");

  // Log and call API when all scores are filled
  useEffect(() => {
    if (!scoresNotReady()) {
      const result = {
        scores,
        outcome: 'played'
      };
      API.updateScore(fixture.tournamentId, fixture.id, result)
        .then(() => console.log("Scores successfully updated"))
        .catch((error) => console.error("Error updating scores:", error));
    }
  }, [scores, fixture.tournamentId, fixture.id]);

  // Handlers for Proceed actions
  const handleScoreProceed = () => {
    console.log("Scores saved:", scores);
    onClose();
  };

  const handleCardsProceed = () => {
    const formattedPlayers = [
      ...cardedPlayers.team1.map(card => ({
        playerId: card.number,
        cardColor: card.cardType,
        playerName: card.name,
        team: fixture.team1,
      })),
      ...cardedPlayers.team2.map(card => ({
        playerId: card.number,
        cardColor: card.cardType,
        playerName: card.name,
        team: fixture.team2,
      })),
    ];
    console.log("Carded players updated:", formattedPlayers);
    onClose();
  };

  const handleCancelProceed = () => {
    console.log("Match cancelled with reason:", cancellationOption);
    onClose();
  };

  return (
    <div className="dialog-update">
      <div className="drawer-header">
        <div className="title">Update Fixture</div>
        <div className="tab-navigation">
          <button
            className={currentTab === "score" ? "active" : ""}
            onClick={() => setCurrentTab("score")}
          >
            Set Score
          </button>
          <button
            className={currentTab === "cancel" ? "active" : ""}
            onClick={() => setCurrentTab("cancel")}
          >
            Cancel Match
          </button>
          <button
            className={currentTab === "cards" ? "active" : ""}
            onClick={() => setCurrentTab("cards")}
          >
            Card Players
          </button>
        </div>
      </div>
      <div className="drawer-container">
        <div className="tab-content">
          <div style={{ display: currentTab === "score" ? "block" : "none" }}>
            <TabScore
              scores={scores}
              setScores={setScores}
              fixture={fixture}
              onProceed={handleScoreProceed}
              onClose={onClose}
            />
          </div>
          <div style={{ display: currentTab === "cancel" ? "block" : "none" }}>
            <TabCancel
              cancellationOption={cancellationOption}
              setCancellationOption={setCancellationOption}
              onConfirm={handleCancelProceed}
              onClose={onClose}
              team1={fixture.team1}
              team2={fixture.team2}
              fixture={fixture} // Add fixture prop
            />
          </div>
          <div style={{ display: currentTab === "cards" ? "block" : "none" }}>
            <TabCards
              cardedPlayers={cardedPlayers}
              setCardedPlayers={setCardedPlayers}
              fixture={fixture}
              onProceed={handleCardsProceed}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
      <div className="drawer-footer">
        <button
          disabled={scoresNotReady()}
          className={scoresNotReady() ? "disabled" : "enabled"}
          onClick={() => {}} // saveScore
        >
          Proceed
        </button>
        <button onClick={handleCancelProceed}>Cancel</button>
      </div>
    </div>
  );
};

export default DialogUpdate;
