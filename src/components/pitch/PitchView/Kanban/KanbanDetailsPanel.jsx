import { useState, useEffect, useRef } from 'react'; // Added useEffect, useRef
import './KanbanDetailsPanel.scss';
import FixtureBar from '../Fixture/FixtureBar';
import { useFixtureContext } from '../../PitchView/FixturesContext';
import { formatTeamName, militaryTimeDiffMins } from "../../../../shared/generic/TeamNameDisplay";
import ClockIcon from "../../../../shared/generic/ClockIcon";
import UmpiresIcon from "../../../../shared/icons/icon-umpires-circle.svg?react";
import API from '../../../../shared/api/endpoints'; // Import API
import '../../../../components/web/gaelic-score';
import '../../../../components/web/logo-box';
import '../../../../components/web/team-name';
import TabCancel from '../UpdateFixture/DialogUpdate/TabCancel';
import TabScore from '../UpdateFixture/DialogUpdate/TabScore'; // Import TabScore
import TabCards from '../UpdateFixture/DialogUpdate/TabCards'; // Import TabCards

const KanbanDetailsPanel = ({ 
  fixture,
  mode = 'info',
  closePanel,
  moveToNextFixture // Accept moveToNextFixture
}) => {
  if (!fixture) return null;

  const displayCategory = fixture.category
    ? fixture.category.substring(0, 9).toUpperCase()
    : '';
  const displayStage = fixture.stage
    ? fixture.stage.toUpperCase()
      .replace('PLT', 'Plate')
      .replace('CUP', 'Cup')
      .replace('SHD', 'Shield')
      .replace('_', '/')
    : '';

  // Check if all score values are valid 

  return (
    <div className="kanban-details-panel">
      <FixtureBar
        fixtureId={fixture.id}
        category={displayCategory}
        stage={displayStage}
        number={fixture.groupNumber || '0'}
      />

      <div className="details-content-wrapper">
        <section className="mt-7 mr-0 pr-0">
          <ClockIcon
            scheduled={fixture.scheduledTime || fixture.plannedStart}
            started={fixture.startedTime || fixture.actualStartedTime}
            delay={militaryTimeDiffMins(fixture.scheduledTime || fixture.plannedStart, fixture.startedTime || fixture.actualStartedTime)}
            played={!!fixture.startedTime || !!fixture.actualStartedTime}
            size={100}
          />

          <div className="p-6 pt-12 ml-12 mr-12 rounded-3xl border-solid border-4" style={{ borderColor: '#FFFFFF00'}}>
            <div className="match-up">
              <div></div>
              <div className="team team-1">
                <logo-box title={fixture.team1 || 'TBD'} size="140px" border-color="#e11d48"></logo-box>
              </div>
              <div className="text-6xl">vs.</div>
              <div className="team team-2">
                <logo-box title={fixture.team2 || 'TBD'} size="140px" border-color="#38bdf8"></logo-box>
              </div>
              <div></div>
            </div>

            <div className="match-teams">
              <div></div>
              <div className="text-3xl" style={{ textAlign: 'center' }}>{formatTeamName(fixture.team1 || 'TBD')}</div>
              <div></div>
              <div className="text-3xl" style={{ textAlign: 'center' }}>{formatTeamName(fixture.team2 || 'TBD')}</div>
              <div></div>
            </div>
            {mode === 'info' && <ShowFixtureDetails fixture={fixture} />}
            {mode === 'forfeit' && <ShowForfeitOptions fixture={fixture} closePanel={closePanel} />}
            {mode === 'cards' && (
              <CardEntryWrapper
                fixture={fixture}
                closePanel={closePanel}
              />
            )}
            {mode === 'score' && (
              <ScoreEntryWrapper
                fixture={fixture}
                closePanel={closePanel}
                moveToNextFixture={moveToNextFixture}
              />
            )}
          </div>

        </section>
      </div>
    </div>
  );
};

export default KanbanDetailsPanel;


function ShowFixtureDetails({
  fixture,
}) {
  const hasScores = fixture.score1 || fixture.score2;
  const hasGoalsPoints = typeof fixture.goals1 === 'number' &&
    typeof fixture.goals2 === 'number' &&
    typeof fixture.points1 === 'number' &&
    typeof fixture.points2 === 'number';
  return (
    <>
      {
        hasGoalsPoints ? (
          <div className="match-scores">
            <div></div>
            <div className="team-score team1-score">
              <gaelic-score
                goals={fixture.goals1}
                points={fixture.points1}
                layout="over"
                scale="2.2"
                played="true"
              ></gaelic-score>
            </div>
            <div></div>
            <div className="team-score team2-score">
              <gaelic-score
                goals={fixture.goals2}
                points={fixture.points2}
                layout="over"
                scale="2.2"
                played="true"
              ></gaelic-score>
            </div>
            <div></div>
          </div>
        ) : hasScores ? (
          <div className="match-scores plain-scores">
            <div></div>
              <div className="team-score">{fixture.score1 || '?-??'}</div>
              <div></div>
              <div className="team-score">{fixture.score2 || '?-??'}</div>
              <div></div>
            </div>
          ) : (
            <div className="fixture-details">
              <div className="details-grid">
                <div className="detail-item">
                  <strong>Pitch:</strong> {fixture.pitch}
                </div>
                  {fixture.startedTime && (
                    <div className="detail-item">
                      <strong>Actual Start:</strong> {fixture.startedTime}
                    </div>
                  )}
                </div>
              </div>
        )
      }
      {fixture.umpireTeam && (
        <div className="umpires">
          <UmpiresIcon width="82" height="82" />
          <team-name name={fixture.umpireTeam} show-logo="true" direction="r2l" height="35px"></team-name>
        </div>
      )}
    </>
  )
}

function ShowForfeitOptions({
  fixture,
  closePanel // Receive closePanel prop
}) {
  const { fetchFixtures } = useFixtureContext();
  const [cancellationOption, setCancellationOption] = useState(null);

  const handleForfeitConfirm = () => {
    fetchFixtures(); // Refresh data from context
    closePanel();    // Close the details panel
  };

  const handleForfeitClose = () => {
    // cancellationOption is reset within TabCancel before it calls onClose
    closePanel();    // Close the details panel
  };

  if (!fixture) return null;

  return (
    <div className="forfeit-options-container" style={{ marginTop: '2rem' }}> {/* Added a wrapper and some margin */}
      <TabCancel
        fixture={fixture}
        team1={fixture.team1 || "Team 1"}
        team2={fixture.team2 || "Team 2"}
        cancellationOption={cancellationOption}
        setCancellationOption={setCancellationOption}
        onConfirm={handleForfeitConfirm}
        onClose={handleForfeitClose}
      />
    </div>
  );
}

function ScoreEntryWrapper({ fixture, closePanel, moveToNextFixture }) {
  const { fetchFixtures } = useFixtureContext();
  const [scores, setScores] = useState({
    team1: {
      goals: fixture.goals1 !== undefined ? fixture.goals1 : null,
      points: fixture.points1 !== undefined ? fixture.points1 : null,
    },
    team2: {
      goals: fixture.goals2 !== undefined ? fixture.goals2 : null,
      points: fixture.points2 !== undefined ? fixture.points2 : null,
    },
  });

  const handleScoreProceed = async () => {
    try {
      const result = {
        scores: {
          team1: {
            goals: parseInt(scores.team1.goals, 10) || 0,
            points: parseInt(scores.team1.points, 10) || 0,
          },
          team2: {
            goals: parseInt(scores.team2.goals, 10) || 0,
            points: parseInt(scores.team2.points, 10) || 0,
          },
        },
        // outcome might be needed by API.updateScore, adjust if necessary
      };
      await API.updateScore(fixture.tournamentId, fixture.id, result);
      await API.endMatch(fixture.tournamentId, fixture.id); // End the match
      await fetchFixtures(true); // Refresh fixtures, progressing nextFixture
      moveToNextFixture && moveToNextFixture(); // Move to next fixture in UI if applicable
      closePanel(); // Close the panel
    } catch (error) {
      console.error("Error proceeding with score:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleScoreClose = () => {
    closePanel(); // Just close the panel without saving
  };

  return (
    <div className="score-entry-container" style={{ marginTop: '2rem' }}>
      <TabScore
        fixture={fixture}
        scores={scores}
        setScores={setScores}
        onProceed={handleScoreProceed}
        onClose={handleScoreClose}
      />
    </div>
  );
}

function CardEntryWrapper({ fixture, closePanel }) {
  const { fetchFixtures } = useFixtureContext();
  const [cardedPlayers, setCardedPlayers] = useState(() => {
    if (fixture.cardedPlayers && Array.isArray(fixture.cardedPlayers)) {
      return {
        team1: fixture.cardedPlayers.filter(p => p.team === fixture.team1 && p.id), // Ensure cards have IDs
        team2: fixture.cardedPlayers.filter(p => p.team === fixture.team2 && p.id), // Ensure cards have IDs
      };
    }
    return { team1: [], team2: [] };
  });

  const isInitialMount = useRef(true); // Ref to track initial mount

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // Don't run on initial mount
    }

    const persistCardChanges = async () => {
      const playersToUpdate = [
        ...(cardedPlayers.team1 || []),
        ...(cardedPlayers.team2 || []),
      ].map(card => ({ // Ensure structure matches API expectation, remove temporary IDs if necessary
        ...card,
        id: typeof card.id === 'number' && card.id > 1000000 ? null : card.id // Example: nullify temporary IDs
      }));

      try {
        console.log("Auto-saving carded players:", playersToUpdate);
        for (const player of playersToUpdate) {
          // If the player has a temporary ID (e.g., from Date.now()),
          // it might need to be handled differently or sent as null
          // depending on how API.updateCardedPlayer handles new vs existing cards.
          // Assuming API.updateCardedPlayer can handle creating a new card if id is null
          // or updating if id is present.
          const payload = { ...player };
          if (typeof player.id === 'number' && player.id > 1000000) {
            // This indicates a temporary ID used for local state management.
            // The backend might expect 'id' to be null for new entries.
            payload.id = null;
          }
          await API.updateCardedPlayer(fixture.tournamentId, fixture.id, payload);
        }
        console.log("Successfully auto-saved carded players");
        await fetchFixtures(true); // Refresh fixtures after successful save
      } catch (error) {
        console.error("Error auto-saving carded players:", error);
      }
    };

    // Simple debounce implementation
    const timerId = setTimeout(() => {
      persistCardChanges();
    }, 1000); // Debounce API call by 1 second

    return () => clearTimeout(timerId); // Cleanup timeout

  }, [cardedPlayers, fixture.id, fixture.tournamentId, fetchFixtures]);


  const handleSetCardedPlayer = (cardUpdate) => {
    setCardedPlayers(prev => {
      const teamKey = cardUpdate.team === fixture.team1 ? 'team1' : 'team2';
      let teamCards = [...(prev[teamKey] || [])]; // Ensure prev[teamKey] is an array

      if (cardUpdate.action === 'delete') {
        teamCards = teamCards.filter((card) => card.id !== cardUpdate.id); // Fixed: Added opening parenthesis
      } else if (cardUpdate.id && !(typeof cardUpdate.id === 'number' && cardUpdate.id > 1000000)) { // Existing card (not a temp ID)
        teamCards = teamCards.map(card => card.id === cardUpdate.id ? { ...card, ...cardUpdate } : card);
      } else {
        // New card or card with temp ID being confirmed
        // If it was a temp ID, find and update; otherwise, add new
        const tempId = cardUpdate.id; // Store temp ID if present

        let foundAndUpdated = false;
        if (tempId && typeof tempId === 'number' && tempId > 1000000) {
          teamCards = teamCards.map(card => {
            if (card.id === tempId) {
              foundAndUpdated = true;
              return { ...card, ...cardUpdate, id: card.id }; // Keep original temp ID for now, API call will handle it
            }
            return card;
          });
        }
        if (!foundAndUpdated) {
          // Ensure new cards get a temporary, unique ID for local list management
          teamCards.push({ ...cardUpdate, id: Date.now() });
        }
      }
      return { ...prev, [teamKey]: teamCards };
    });
  };

  return (
    <div className="card-entry-container" style={{ marginTop: '1rem' }}>
      <TabCards
        team1={fixture.team1 || "Team 1"}
        team2={fixture.team2 || "Team 2"}
        cardedPlayers={cardedPlayers}
        setCardedPlayer={handleSetCardedPlayer}
        fixture={fixture}
      />
    </div>
  );
}
