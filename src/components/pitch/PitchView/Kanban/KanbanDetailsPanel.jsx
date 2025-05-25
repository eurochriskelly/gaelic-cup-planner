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

  const isInitialMount = useRef(true); // Ref to track initial mount for debounced effect
  const syncedCardedPlayersRef = useRef({ team1: [], team2: [] });

  // Effect to initialize/update syncedCardedPlayersRef when fixture.cardedPlayers (the source of truth) changes
  useEffect(() => {
    if (fixture.cardedPlayers && Array.isArray(fixture.cardedPlayers)) {
      syncedCardedPlayersRef.current = {
        team1: fixture.cardedPlayers.filter(p => p.team === fixture.team1 && p.id && !(typeof p.id === 'number' && p.id > 1000000)),
        team2: fixture.cardedPlayers.filter(p => p.team === fixture.team2 && p.id && !(typeof p.id === 'number' && p.id > 1000000)),
      };
    } else {
      syncedCardedPlayersRef.current = { team1: [], team2: [] };
    }
  }, [fixture.cardedPlayers, fixture.team1, fixture.team2]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // Don't run on initial mount
    }

    const persistCardChanges = async () => {
      console.log('Debounced persistCardChanges triggered...');
      const currentCardsTeam1 = cardedPlayers.team1 || [];
      const currentCardsTeam2 = cardedPlayers.team2 || [];
      const syncedCardsTeam1 = syncedCardedPlayersRef.current.team1 || [];
      const syncedCardsTeam2 = syncedCardedPlayersRef.current.team2 || [];

      const playersToUpdate = [];

      const findAndCompareCard = (currentCard, syncedTeamCards) => {
        // Only consider cards with real IDs (not temporary ones) for update
        if (!currentCard.id || (typeof currentCard.id === 'number' && currentCard.id > 1000000)) {
          return null;
        }
        const syncedCard = syncedTeamCards.find(sc => sc.id === currentCard.id);

        if (!syncedCard) {
          // This card is in current state with a real ID but not in our last synced snapshot.
          // This could happen if it was just added and syncedRef hasn't updated yet.
          // For an auto-save of *modifications*, we should only update cards that were previously known (synced).
          // Additions are handled by TabCards' explicit save.
          return null;
        }

        // Compare relevant editable properties
        if (currentCard.player !== syncedCard.player ||
            currentCard.cardType !== syncedCard.cardType ||
            currentCard.notes !== syncedCard.notes ||
            currentCard.number !== syncedCard.number // Assuming 'number' (jersey) is editable
           ) {
          return currentCard; // This card has changed
        }
        return null; // No changes detected for this card
      };

      currentCardsTeam1.forEach(cc => {
        const changedCard = findAndCompareCard(cc, syncedCardsTeam1);
        if (changedCard) playersToUpdate.push(changedCard);
      });
      currentCardsTeam2.forEach(cc => {
        const changedCard = findAndCompareCard(cc, syncedCardsTeam2);
        if (changedCard) playersToUpdate.push(changedCard);
      });

      if (playersToUpdate.length > 0) {
        try {
          console.log("Auto-saving updates to specific carded players:", playersToUpdate);
          for (const player of playersToUpdate) {
            await API.updateCardedPlayer(fixture.tournamentId, fixture.id, player);
          }
          console.log("Successfully auto-saved updates to specific carded players.");
          // After successful updates, fetchFixtures will refresh the data,
          // which in turn will update fixture.cardedPlayers prop,
          // and the other useEffect will update syncedCardedPlayersRef.current.
          await fetchFixtures(true);
        } catch (error) {
          console.error("Error auto-saving updates to specific carded players:", error);
          // If an error occurs, syncedCardedPlayersRef is not updated with these changes,
          // allowing a retry on the next trigger if the data is still different.
        }
      } else {
        console.log("No actual card changes detected for auto-save.");
      }
    };

    const timerId = setTimeout(persistCardChanges, 1000); // Debounce API call by 1 second
    return () => clearTimeout(timerId); // Cleanup timeout

  }, [cardedPlayers, fixture.id, fixture.tournamentId, fetchFixtures]); // Dependencies remain the same


  const handleSetCardedPlayer = (cardUpdate) => {
    setCardedPlayers(prev => {
      const teamKey = cardUpdate.team === fixture.team1 ? 'team1' : 'team2';
      let teamCards = [...(prev[teamKey] || [])];
      const existingCardIndex = teamCards.findIndex(c => c.id === cardUpdate.id);

      if (cardUpdate.action === 'delete') {
        if (existingCardIndex !== -1) {
          teamCards.splice(existingCardIndex, 1);
          // Note: The API call to delete the card on the backend should be triggered
          // by TabCards or explicitly here, followed by fetchFixtures if needed.
        }
      } else if (existingCardIndex !== -1) {
        // Card with cardUpdate.id already exists in local state. Update it.
        // This handles updates to existing cards, whether they have real or temporary IDs.
        teamCards[existingCardIndex] = { ...teamCards[existingCardIndex], ...cardUpdate };
      } else {
        // Card with cardUpdate.id does not exist in local state. This means it's a new card to be added.
        // It could be:
        // 1. A card freshly created in the UI, where cardUpdate.id might be undefined or a new temporary ID.
        // 2. A card that was just saved to the server, and cardUpdate includes the new real ID from the server.

        if (cardUpdate.id && !(typeof cardUpdate.id === 'number' && cardUpdate.id > 1000000)) {
          // Case 2: cardUpdate.id is a real ID (e.g., 123 from the server).
          // Since it wasn't found by findIndex, it's genuinely new to the local list. Add it.
          // cardUpdate should contain all necessary details including the real ID.
          teamCards.push({ ...cardUpdate });
        } else {
          // Case 1: cardUpdate.id is undefined, or it's a temporary ID (e.g., from Date.now()).
          // This is for a card being added locally for the first time, before server confirmation,
          // or if TabCards passes a temporary ID directly.
          // Assign a new temporary Date.now() ID to ensure it's unique for local list management.
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
