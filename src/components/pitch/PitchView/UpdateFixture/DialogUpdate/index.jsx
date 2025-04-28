import { useState } from "react";
import TabScore from "./TabScore";
import TabCards from "./TabCards";
import TabCancel from "./TabCancel";
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

  // Handlers for Proceed actions
  const handleScoreProceed = () => {
    console.log("Scores saved:", scores);
    onClose();
    // In a real app, you'd send scores to the server here
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
    // In a real app, you'd send carded players to the server here
  };

  const handleCancelProceed = () => {
    console.log("Match cancelled with reason:", cancellationOption);
    onClose();
    // In a real app, you'd send cancellation option to the server here
  };

  return (
    <div className="dialog-update">
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
  );
};

export default DialogUpdate;
