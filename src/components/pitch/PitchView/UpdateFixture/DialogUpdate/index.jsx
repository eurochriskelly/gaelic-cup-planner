import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import TabScore from "./TabScore";
import TabCards from "./TabCards";
import TabCancel from "./TabCancel";
import API from "../../../../../shared/api/endpoints";
import './DialogUpdate.scss';

// Changed props to fixtureId and tournamentId instead of fixture
const DialogUpdate = ({ 
  nextFixture,
  onClose 
}) => {
  const { tournamentId } = useParams();
  const fixtureId = nextFixture?.id;
  // Added state to store the complete fixture data
  const [fixture, setFixture] = useState(null);
  const [currentTab, setCurrentTab] = useState("score");
  // Initialize with empty values since we'll get real data from the API
  const [scores, setScores] = useState({
    team1: { goals: "", points: "", name: "" },
    team2: { goals: "", points: "", name: "" },
  });
  const [cardedPlayers, setCardedPlayers] = useState({ team1: [], team2: [] });
  const [cancellationOption, setCancellationOption] = useState(null);
  const initialLoadRef = useRef(true);
  const originalScoresRef = useRef({
    team1: { goals: "", points: "" },
    team2: { goals: "", points: "" }
  });

  // Helper function to refresh fixture data
  const refreshFixtureData = () => {
    console.log('Fetching fixture data from server...');
    return API.fetchFixture(tournamentId, fixtureId)
      .then(({ data }) => {
        if (data) {
          setFixture(data); // Store the complete fixture data

          const { cardedPlayers, goals1, goals2, points1, points2, team1, team2, outcome } = data;

          // Update original scores reference
          originalScoresRef.current = {
            team1: { goals: goals1 ?? "", points: points1 ?? "" },
            team2: { goals: goals2 ?? "", points: points2 ?? "" }
          };

          setScores({
            team1: { goals: goals1 ?? "", points: points1 ?? "", name: team1 },
            team2: { goals: goals2 ?? "", points: points2 ?? "", name: team2 },
          });

          setCardedPlayers({
            team1: cardedPlayers?.filter(player => player.team === team1) || [],
            team2: cardedPlayers?.filter(player => player.team === team2) || [],
          });

          // Update tab based on API data outcome
          if (outcome === 'skipped') {
            console.log('Setting tab to "cancel" based on API outcome === skipped');
            setCurrentTab('cancel');
          } else if (outcome === 'played') {
            console.log('Setting tab to "score" based on API outcome === played');
            setCurrentTab('score');
          }
        }
        return data;
      })
      .catch(error => {
        console.error("Error refreshing fixture data:", error);
        throw error;
      });
  };

  // Set initial tab based on fixture data once it's loaded
  useEffect(() => {
    if (!fixture) return;

    if (fixture.outcome === 'skipped') {
      setCurrentTab('cancel');
    } else {
      setCurrentTab('score');
    }
  }, [fixture?.outcome]);

  // Initial data fetch using the provided IDs
  useEffect(() => {
    refreshFixtureData()
      .finally(() => {
        initialLoadRef.current = false;
      });
  }, [fixtureId, tournamentId]);

  // Update scores effect
  useEffect(() => {
    if (initialLoadRef.current || !fixture) return;

    const hasScores = Object.values(scores).every(
      team => team.goals !== "" && team.points !== ""
    );

    // Check if scores have changed from original
    const scoresHaveChanged =
      scores.team1.goals !== originalScoresRef.current.team1.goals ||
      scores.team1.points !== originalScoresRef.current.team1.points ||
      scores.team2.goals !== originalScoresRef.current.team2.goals ||
      scores.team2.points !== originalScoresRef.current.team2.points;

    if (hasScores && scoresHaveChanged) {
      console.log('Updating scores - detected changes:', {
        current: scores,
        original: originalScoresRef.current
      });

      const result = { scores, outcome: 'played' };
      API.updateScore(tournamentId, fixtureId, result)
        .then(() => {
          console.log('Score update successful, refreshing data');
          return refreshFixtureData();
        })
        .catch(error => console.error("Error updating scores:", error));
    }
  }, [scores, fixtureId, tournamentId, fixture]);

  const registerCardedPlayer = (player) => {
    const action = player?.action === "delete"
      ? API.deleteCardedPlayer
      : API.updateCardedPlayer;

    action(tournamentId, fixtureId, player)
      .then(() => {
        console.log(`Card ${player?.action === "delete" ? "removal" : "update"} successful, refreshing data`);
        return refreshFixtureData();
      })
      .catch(error => {
        console.error(`Error with carded player ${player?.action}:`, error);
      });
  };

  const renderTabContent = () => {
    // Don't render tabs until fixture data is loaded
    if (!fixture) return <div>Loading...</div>;

    switch (currentTab) {
      case "score":
        return (
          <TabScore
            scores={scores}
            setScores={setScores}
            fixture={fixture}
          />
        );
      case "cancel":
        return (
          <TabCancel
            cancellationOption={cancellationOption}
            setCancellationOption={setCancellationOption}
            onConfirm={onClose}
            onClose={onClose}
            team1={fixture.team1}
            team2={fixture.team2}
            fixture={fixture}
          />
        );
      case "cards":
        return (
          <TabCards
            team1={fixture.team1}
            team2={fixture.team2}
            cardedPlayers={cardedPlayers}
            setCardedPlayer={registerCardedPlayer}
            fixture={fixture}
          />
        );
      default:
        return null;
    }
  };

  // Show loading state while waiting for fixture data
  if (!fixture) {
    return <div className="dialog-update">Loading fixture data...</div>;
  }

  return (
    <div className="dialog-update">
      <div className="drawer-header">
        <div className="title">
          <span className="mr-8">
            Update Fixture <span className="ml-2 text-gray-500">#{fixtureId?.toString().slice(-3)}</span>
          </span>
          <i
            className="pi pi-check-circle"
            onClick={onClose}
            role="button"
            aria-label="Close"
          />
        </div>
        <div className="tab-navigation">
          {["score", "cancel", "cards"].map(tab => (
            <button
              key={tab}
              className={currentTab === tab ? "active" : ""}
              onClick={() => setCurrentTab(tab)}
            >
              {tab === "score" ? "Set Score" : tab === "cancel" ? "Cancel Match" : "Card Players"}
            </button>
          ))}
        </div>
      </div>
      <div className="drawer-container">
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DialogUpdate;