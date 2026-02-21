import { useState, useEffect, useRef, useMemo } from 'react'; // Added useMemo
import './KanbanDetailsPanel.scss';
import FixtureBar from './FixtureBar';
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
import Select from 'react-select';

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
        competitionPrefix={fixture?.competition?.initials}
        competitionOffset={fixture?.competition?.offset}
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
             {mode === 'move' && (
               <MoveFixtureWrapper
                 fixture={fixture}
                 closePanel={closePanel}
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
      goalsExtra: fixture.goals1Extra !== undefined ? fixture.goals1Extra : null,
      pointsExtra: fixture.points1Extra !== undefined ? fixture.points1Extra : null,
      goalsPenalties: fixture.goals1Penalties !== undefined ? fixture.goals1Penalties : null,
      pointsPenalties: fixture.points1Penalties !== undefined ? fixture.points1Penalties : null,
    },
    team2: {
      goals: fixture.goals2 !== undefined ? fixture.goals2 : null,
      points: fixture.points2 !== undefined ? fixture.points2 : null,
      goalsExtra: fixture.goals2Extra !== undefined ? fixture.goals2Extra : null,
      pointsExtra: fixture.points2Extra !== undefined ? fixture.points2Extra : null,
      goalsPenalties: fixture.goals2Penalties !== undefined ? fixture.goals2Penalties : null,
      pointsPenalties: fixture.points2Penalties !== undefined ? fixture.points2Penalties : null,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEndMatchWarning, setShowEndMatchWarning] = useState(false);

  // Helper to convert score value
  const toScoreValue = (val) => {
    if (val === "" || val === null || val === undefined) return null;
    return parseInt(val, 10);
  };

  // Build scores object conditionally
  const buildTeamScores = (teamData, teamName) => {
    const result = {
      name: teamName,
      goals: parseInt(teamData.goals, 10) || 0,
      points: parseInt(teamData.points, 10) || 0,
    };

    const goalsExtra = toScoreValue(teamData.goalsExtra);
    const pointsExtra = toScoreValue(teamData.pointsExtra);
    if (goalsExtra !== null) result.goalsExtra = goalsExtra;
    if (pointsExtra !== null) result.pointsExtra = pointsExtra;

    const goalsPenalties = toScoreValue(teamData.goalsPenalties);
    const pointsPenalties = toScoreValue(teamData.pointsPenalties);
    if (goalsPenalties !== null) result.goalsPenalties = goalsPenalties;
    if (pointsPenalties !== null) result.pointsPenalties = pointsPenalties;

    return result;
  };

  const handleUpdateScore = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const result = {
        outcome: 'played',
        scores: {
          team1: buildTeamScores(scores.team1, fixture.team1),
          team2: buildTeamScores(scores.team2, fixture.team2),
        },
      };
      await API.updateScore(fixture.tournamentId, fixture.id, result);
      await fetchFixtures(true); // Refresh fixtures
      closePanel(); // Close the panel
    } catch (error) {
      console.error("Error updating score:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalScore = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const result = {
        outcome: 'played',
        scores: {
          team1: buildTeamScores(scores.team1, fixture.team1),
          team2: buildTeamScores(scores.team2, fixture.team2),
        },
      };
      await API.updateScore(fixture.tournamentId, fixture.id, result);
      await API.endMatch(fixture.tournamentId, fixture.id); // End the match
      await fetchFixtures(true); // Refresh fixtures, progressing nextFixture
      moveToNextFixture && moveToNextFixture(); // Move to next fixture in UI if applicable
      closePanel(); // Close the panel
    } catch (error) {
      console.error("Error finalizing score:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndMatch = () => {
    setShowEndMatchWarning(true);
  };

  const confirmEndMatch = async () => {
    try {
      setIsSubmitting(true);
      setShowEndMatchWarning(false);
      await API.endMatch(fixture.tournamentId, fixture.id);
      await fetchFixtures(true);
      moveToNextFixture && moveToNextFixture();
      closePanel();
    } catch (error) {
      console.error("Error ending match:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEndMatch = () => {
    setShowEndMatchWarning(false);
  };

  return (
    <div className="score-entry-container" style={{ marginTop: '2rem' }}>
      <TabScore
        fixture={fixture}
        scores={scores}
        setScores={setScores}
        onProceed={null} // Remove single proceed, we'll add buttons below
        isSubmitting={isSubmitting}
      />
      <div className="score-action-buttons">
        <button
          className="btn btn-secondary"
          onClick={handleUpdateScore}
          disabled={isSubmitting}
        >
          <span className="button-icon">✏️</span>
          Update Score
        </button>
        <button
          className="btn btn-primary"
          onClick={handleFinalScore}
          disabled={isSubmitting}
        >
          <span className="button-icon">✅</span>
          Final Score
        </button>
        <button
          className="btn btn-warning"
          onClick={handleEndMatch}
          disabled={isSubmitting}
        >
          <span className="button-icon">🛑</span>
          End Match
        </button>
      </div>
      {showEndMatchWarning && (
        <div className="reschedule-message-overlay">
          <div className="reschedule-message">
            <div className="warning-icon">⚠️</div>
            <div className="warning-message">This will end the match without a score, freeing up the pitch for other teams. Are you sure?</div>
            <div className="warning-actions">
              <button onClick={cancelEndMatch}>No</button>
              <button onClick={confirmEndMatch}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CardEntryWrapper({ fixture, closePanel }) {
  const { fetchFixtures } = useFixtureContext();
  const [cardedPlayers, setCardedPlayers] = useState(() => {
    if (fixture.cards && Array.isArray(fixture.cards)) {
      return { 
        team1: fixture.cards.filter(p => p.team === fixture.team1),
        team2: fixture.cards.filter(p => p.team === fixture.team2),
      };
    }
    return { team1: [], team2: [] };
  });

  const isInitialMount = useRef(true); // Ref to track initial mount for debounced effect
  const syncedCardedPlayersRef = useRef({ team1: [], team2: [] });

  // Effect to update local cardedPlayers state when fixture prop changes
  useEffect(() => {
    if (fixture.cards && Array.isArray(fixture.cards)) {
      const res = {
        team1: fixture.cards.filter(p => p.team === fixture.team1),
        team2: fixture.cards.filter(p => p.team === fixture.team2),
      }
      setCardedPlayers(res);
    } else {
      setCardedPlayers({ team1: [], team2: [] });
    }
  }, [fixture.cards, fixture.team1, fixture.team2]); // Removed setCardedPlayers from deps as it's stable

  // Effect to initialize/update syncedCardedPlayersRef when fixture.cards (the source of truth) changes
  useEffect(() => {
    if (fixture.cards && Array.isArray(fixture.cards)) {
      syncedCardedPlayersRef.current = {
        team1: fixture.cards.filter(p => p.team === fixture.team1 && p.id && !(typeof p.id === 'number' && p.id > 1000000)),
        team2: fixture.cards.filter(p => p.team === fixture.team2 && p.id && !(typeof p.id === 'number' && p.id > 1000000)),
      };
    } else {
      syncedCardedPlayersRef.current = { team1: [], team2: [] };
    }
  }, [fixture.cards, fixture.team1, fixture.team2]);

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


  const handleSetCardedPlayer = async (cardDataFromTab) => {
    const { tournamentId, id: fixtureId, team1: fixtureTeam1Name } = fixture;

    if (cardDataFromTab.action === 'delete') {
      const cardIdToDelete = cardDataFromTab.id;
      // Check if the card to delete has a real ID (i.e., it exists on the backend)
      const isRealCard = cardIdToDelete && !(typeof cardIdToDelete === 'number' && cardIdToDelete > 1000000);

      if (isRealCard) {
        try {
          await API.deleteCardedPlayer(tournamentId, fixtureId, cardDataFromTab); // API expects card object
          // Update local state by removing the card
          setCardedPlayers(prev => {
            const teamKey = cardDataFromTab.team === fixtureTeam1Name ? 'team1' : 'team2';
            const newTeamCards = (prev[teamKey] || []).filter(c => c.id !== cardIdToDelete);
            return { ...prev, [teamKey]: newTeamCards };
          });
          await fetchFixtures(true); // Refresh all fixture data
        } catch (error) {
          console.error('Error deleting card from backend:', error);
          // TODO: Optionally show an error message to the user
        }
      } else {
        // Card has no real ID (was temporary and not saved to backend), just remove from local state
        setCardedPlayers(prev => {
          const teamKey = cardDataFromTab.team === fixtureTeam1Name ? 'team1' : 'team2';
          const newTeamCards = (prev[teamKey] || []).filter(c => c.id !== cardIdToDelete); // cardIdToDelete is temp ID
          return { ...prev, [teamKey]: newTeamCards };
        });
      }
      return;
    }

    // --- Add or Update card ---
    const isExistingCardWithRealId = cardDataFromTab.id && !(typeof cardDataFromTab.id === 'number' && cardDataFromTab.id > 1000000);
    
    const payload = { ...cardDataFromTab };
    delete payload.action; // 'action' is not part of the card model for backend update/create

    if (!isExistingCardWithRealId) {
      // This is a new card being added.
      // Remove temporary ID if TabCards assigned one; backend will assign the real ID.
      // This assumes API.updateCardedPlayer can create if ID is missing in payload.
      delete payload.id; 
    }

    try {
      // API.updateCardedPlayer is assumed to handle both create (if no ID in payload) and update.
      const savedCard = await API.updateCardedPlayer(tournamentId, fixtureId, payload);

      setCardedPlayers(prev => {
        const teamKey = savedCard.team === fixtureTeam1Name ? 'team1' : 'team2';
        let teamCards = [...(prev[teamKey] || [])];

        if (isExistingCardWithRealId) {
          // It was an update to an existing card
          teamCards = teamCards.map(c => c.id === savedCard.id ? savedCard : c);
        } else {
          // It was a new card that has been created
          // If TabCards passed a temporary ID with the original cardDataFromTab, remove that temporary entry
          if (cardDataFromTab.id && (typeof cardDataFromTab.id === 'number' && cardDataFromTab.id > 1000000)) {
            teamCards = teamCards.filter(c => c.id !== cardDataFromTab.id);
          }
          teamCards.push(savedCard); // Add the newly saved card with its real ID
        }
        return { ...prev, [teamKey]: teamCards };
      });
      await fetchFixtures(true); // Refresh all fixture data to ensure consistency
    } catch (error) {
      console.error('Error saving card (add/update):', error);
      // TODO: Optionally show an error message to the user
    }
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

function MoveFixtureWrapper({ fixture, closePanel }) {
  const { fetchFixtures } = useFixtureContext();
  const [pitches, setPitches] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selectedPitch, setSelectedPitch] = useState(fixture.pitch || "");
  const [placement, setPlacement] = useState('after');
  const [targetFixtureId, setTargetFixtureId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const tournamentId = fixture.tournamentId;

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (!tournamentId) return;
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [pitchesResponse, fixturesResponse] = await Promise.all([
          API.fetchPitches(tournamentId),
          API.fetchAllFixtures(tournamentId),
        ]);

        if (cancelled) return;

        const pitchList = Array.isArray(pitchesResponse?.data)
          ? pitchesResponse.data.map((p) => p.pitch)
          : [];
        const fixtureList = Array.isArray(fixturesResponse?.data)
          ? fixturesResponse.data
          : [];

        setPitches(pitchList);
        setFixtures(fixtureList);

        if (pitchList.length) {
          setSelectedPitch((prev) => {
            if (prev && pitchList.includes(prev)) return prev;
            if (fixture.pitch && pitchList.includes(fixture.pitch)) return fixture.pitch;
            return pitchList[0];
          });
        }
      } catch (error) {
        if (cancelled) return;
        console.error('Error loading move options:', error);
        setErrorMessage('Unable to load pitch and fixture information right now.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [tournamentId, fixture.pitch]);

  useEffect(() => {
    setTargetFixtureId(null);
  }, [selectedPitch, placement]);

  const fixturesOnSelectedPitch = useMemo(() => {
    return fixtures
      .filter((f) => f.id !== fixture.id && f.pitch === selectedPitch)
      .sort((a, b) => {
        const left = a.scheduledTime || a.plannedStart || '';
        const right = b.scheduledTime || b.plannedStart || '';
        return left.localeCompare(right);
      });
  }, [fixtures, selectedPitch, fixture.id]);

  const selectOptions = useMemo(() => (
    fixturesOnSelectedPitch.map((item) => ({
      value: item.id,
      label: `${item.scheduledTime || item.plannedStart || 'TBD'} • ${item.team1} vs ${item.team2}`,
      meta: item,
    }))
  ), [fixturesOnSelectedPitch]);

  const canSubmit = Boolean(selectedPitch && placement && targetFixtureId && !isSaving);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await API.rescheduleMatch(
        fixture.tournamentId,
        selectedPitch,
        fixture.id,
        targetFixtureId,
        placement,
      );
      await fetchFixtures(true);
      closePanel();
    } catch (error) {
      console.error('Error applying move:', error);
      setErrorMessage('Could not apply the move. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatOptionLabel = ({ meta }) => (
    <div className="move-option-label">
      <span className="move-option-time">{meta.scheduledTime || meta.plannedStart || 'TBD'}</span>
      <span className="move-option-vs">{`${meta.team1} vs ${meta.team2}`}</span>
    </div>
  );

  return (
    <div className="move-entry-wrapper">
      <header className="move-entry-header">
        <h3>Move Fixture</h3>
        <p>Select the destination pitch, the relative position, and the match to anchor this move.</p>
      </header>

      {errorMessage && (
        <div className="move-entry-alert" role="alert">{errorMessage}</div>
      )}

      <div className="move-entry-grid">
        <div className="move-entry-group">
          <label htmlFor="move-pitch">Destination pitch</label>
          <Select
            inputId="move-pitch"
            classNamePrefix="move-select"
            isLoading={isLoading}
            options={pitches.map((pitch) => ({ value: pitch, label: pitch }))}
            value={selectedPitch ? { value: selectedPitch, label: selectedPitch } : null}
            onChange={(option) => setSelectedPitch(option?.value || '')}
            placeholder={isLoading ? 'Loading pitches…' : 'Select pitch'}
            isDisabled={isLoading || !pitches.length}
          />
        </div>

        <div className="move-entry-group">
          <span className="move-entry-label">Placement</span>
          <div className="move-entry-placement">
            {['before', 'after', 'swap'].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="move-placement"
                  value={value}
                  checked={placement === value}
                  onChange={(event) => setPlacement(event.target.value)}
                />
                <span className="move-entry-placement-text">{value === 'swap' ? 'Swap with fixture' : `${value.charAt(0).toUpperCase()}${value.slice(1)} fixture`}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="move-entry-group">
          <label htmlFor="move-anchor">Anchor fixture</label>
          <Select
            inputId="move-anchor"
            classNamePrefix="move-select"
            isLoading={isLoading}
            options={selectOptions}
            value={selectOptions.find((option) => option.value === targetFixtureId) || null}
            onChange={(option) => setTargetFixtureId(option?.value || null)}
            placeholder={
              fixturesOnSelectedPitch.length
                ? 'Select reference fixture'
                : 'No fixtures available on this pitch'
            }
            formatOptionLabel={formatOptionLabel}
            isDisabled={isLoading || !fixturesOnSelectedPitch.length}
          />
        </div>
      </div>

      <div className="move-entry-actions">
        <button type="button" className="btn btn-tertiary" onClick={closePanel}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canSubmit || isLoading || isSaving}
          onClick={handleSubmit}
        >
          {isSaving ? 'Saving…' : 'Apply move'}
        </button>
      </div>
    </div>
  );
}
