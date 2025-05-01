import { useState, useEffect, useRef } from "react";
import TabScore from "./TabScore";
import TabCards from "./TabCards";
import TabCancel from "./TabCancel";
import API from "../../../../../shared/api/endpoints";
import './DialogUpdate.scss';

const DialogUpdate = ({ fixture, onClose }) => {
  const [currentTab, setCurrentTab] = useState("score");
  const [scores, setScores] = useState({
    team1: { goals: fixture.goals1 ?? "", points: fixture.points1 ?? "", name: fixture.team1 },
    team2: { goals: fixture.goals2 ?? "", points: fixture.points2 ?? "", name: fixture.team2 },
  });
  const [cardedPlayers, setCardedPlayers] = useState({ team1: [], team2: [] });
  const [cancellationOption, setCancellationOption] = useState(null);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    API.fetchFixture(fixture.tournamentId, fixture.id)
      .then(({ data }) => {
        if (data) {
          const { cardedPlayers, goals1, goals2, points1, points2, team1, team2 } = data;
          setScores({
            team1: { goals: goals1 ?? "", points: points1 ?? "", name: team1 },
            team2: { goals: goals2 ?? "", points: points2 ?? "", name: team2 },
          });
          setCardedPlayers({
            team1: cardedPlayers.filter(player => player.team === team1),
            team2: cardedPlayers.filter(player => player.team === team2),
          });
        }
      })
      .catch(error => console.error("Error fetching fixture:", error))
      .finally(() => {
        initialLoadRef.current = false;
      });
  }, [fixture.tournamentId, fixture.id]);

  useEffect(() => {
    if (initialLoadRef.current) return;

    const hasScores = Object.values(scores).every(
      team => team.goals !== "" && team.points !== ""
    );

    if (hasScores) {
      const result = { scores, outcome: 'played' };
      API.updateScore(fixture.tournamentId, fixture.id, result)
        .catch(error => console.error("Error updating scores:", error));
    }
  }, [scores, fixture.tournamentId, fixture.id]);

  const registerCardedPlayer = (player) => {
    const action = player?.action === "delete"
      ? API.deleteCardedPlayer
      : API.updateCardedPlayer;
    action(fixture.tournamentId, fixture.id, player);
  };

  const handleCancelProceed = () => {
    onClose();
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case "score":
        return (
          <TabScore
            scores={scores}
            setScores={setScores}
            fixture={fixture}
            onProceed={() => { }}
            onClose={onClose}
          />
        );
      case "cancel":
        return (
          <TabCancel
            cancellationOption={cancellationOption}
            setCancellationOption={setCancellationOption}
            onConfirm={handleCancelProceed}
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
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="dialog-update">
      <div className="drawer-header">
        <div className="title">
          <span className="mr-8">Update Fixture</span>
          <i
            className="pi pi-times-circle"
            onClick={handleCancelProceed}
            style={{ color: 'white', cursor: 'pointer', fontSize: '1.2em' }}
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