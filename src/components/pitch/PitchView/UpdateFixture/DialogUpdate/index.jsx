import { useState, useEffect, useRef } from "react";
import TabScore from "./TabScore";
import TabCards from "./TabCards";
import TabCancel from "./TabCancel";
import API from "../../../../../shared/api/endpoints"; // Import API
import './DialogUpdate.scss';

const DialogUpdate = ({ fixture, onClose }) => {
  const [currentTab, setCurrentTab] = useState("score");
  const initialLoadRef = useRef(true); // Track initial load state

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

  const registereCardedPlayers = (x, y, z) => {
    const formattedPlayers = [
      ...cardedPlayers.team1,
      ...cardedPlayers.team2,
    ];
    console.log("Carded players updated:", formattedPlayers);
    //console.log("Carded players registered:", x(), 'xx', y, z);
  }
  const registereCardedPlayers1 = () => {
    const formattedPlayers = [
      ...cardedPlayers.team1,
      ...cardedPlayers.team2,
    ];
    console.log("Carded players updated:", formattedPlayers);
  };

  // Fetch fixtures when dialog opens and update scores
  useEffect(() => {
    API.fetchFixture(fixture.tournamentId, fixture.id)
      .then(response => {
        // Find the current fixture in the fetched data
        const updatedFixture = response?.data
        if (updatedFixture) {
          // Update scores with fresh data
          const { cardedPlayers, goals1, goals2, points1, points2, team1, team2 } = updatedFixture;
          const scores = {
            team1: { goals: goals1 ?? "", points: points1 ?? "", name: team1 },
            team2: { goals: goals2 ?? "", points: points2 ?? "", name: team2 },
          }
          setScores(scores);
          const carded = {
            team1: cardedPlayers.filter(player => player.team === team1),
            team2: cardedPlayers.filter(player => player.team === team2),
          } 
          console.log('Carded players:', carded);
          setCardedPlayers(carded)
        }
      })
      .catch(error => console.error("Error fetching fixture data:", error))
      .finally(() => {
        // Wait for the next render cycle to set initialLoadRef to false
        setTimeout(() => {
          initialLoadRef.current = false;
        }, 0);
      });
  }, []); // Empty dependency array ensures this runs only once when component mounts

  const scoresNotReady = () => !(scores.team1.goals !== "" && scores.team1.points !== "" && scores.team2.goals !== "" && scores.team2.points !== "");

  // Log and call API when all scores are filled, but not during initial load
  useEffect(() => {
    // Skip the effect during initial load
    if (initialLoadRef.current) {
      return;
    }

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
    // onClose();
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
              setCardedPlayers={registereCardedPlayers}
              fixture={fixture}
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
