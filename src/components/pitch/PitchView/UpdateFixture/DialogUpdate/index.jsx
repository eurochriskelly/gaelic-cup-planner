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
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [cardedPlayers, setCardedPlayers] = useState({ team1: [], team2: [] });
  const [cancellationOption, setCancellationOption] = useState(null);
  const [showFinishedWarning, setShowFinishedWarning] = useState(false);
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
    refreshFixtureData();
  }, [fixtureId, tournamentId]);

  const handleScoreSubmit = async () => {
    if (!fixture || isSubmittingScore) return;

    const isScoreValueSet = (value) => value !== null && value !== undefined && value !== "";
    const allScoresProvided = Object.values(scores).every((team) => (
      isScoreValueSet(team.goals) && isScoreValueSet(team.points)
    ));

    if (!allScoresProvided) {
      console.log('Skipping score submission – incomplete scores');
      return;
    }

    const scoresHaveChanged = (
      scores.team1.goals !== originalScoresRef.current.team1.goals ||
      scores.team1.points !== originalScoresRef.current.team1.points ||
      scores.team2.goals !== originalScoresRef.current.team2.goals ||
      scores.team2.points !== originalScoresRef.current.team2.points
    );

    if (!scoresHaveChanged) {
      console.log('Skipping score submission – no score changes detected');
      return;
    }

    const payload = {
      outcome: 'played',
      scores: {
        team1: {
          name: scores.team1.name || fixture.team1,
          goals: Number(scores.team1.goals) || 0,
          points: Number(scores.team1.points) || 0,
        },
        team2: {
          name: scores.team2.name || fixture.team2,
          goals: Number(scores.team2.goals) || 0,
          points: Number(scores.team2.points) || 0,
        },
      },
    };

    try {
      setIsSubmittingScore(true);
      await API.updateScore(tournamentId, fixtureId, payload);
      await refreshFixtureData();
    } catch (error) {
      console.error('Error updating scores:', error);
    } finally {
      setIsSubmittingScore(false);
    }
  };

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

  const handleConfirmFinishedEdit = () => {
    setShowFinishedWarning(false);
  };

  const handleCancelFinishedEdit = () => {
    setShowFinishedWarning(false);
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
            onProceed={handleScoreSubmit}
            isSubmitting={isSubmittingScore}
            onEditStart={() => {
              console.log('onEditStart called, fixture.ended:', fixture.ended);
              if (fixture.ended) {
                setShowFinishedWarning(true);
                return false;
              }
              return true;
            }}
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
            onEditStart={() => {
              console.log('onEditStart called, fixture.ended:', fixture.ended);
              if (fixture.ended) {
                setShowFinishedWarning(true);
                return false;
              }
              return true;
            }}
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
      {showFinishedWarning && (
        <div className="reschedule-message-overlay">
          <div className="reschedule-message">
            <div className="warning-icon">⚠️</div>
            <div className="warning-message">This match is finished. Are you sure you want to edit it?</div>
            <div className="warning-actions">
              <button onClick={handleCancelFinishedEdit}>No</button>
              <button onClick={handleConfirmFinishedEdit}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogUpdate;
