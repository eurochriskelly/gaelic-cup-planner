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
  const [isAnyScorePickerOpen, setIsAnyScorePickerOpen] = useState(false);

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
    <>
      <div className="kanban-details-panel-backdrop" onClick={closePanel} />
      <div className={`kanban-details-panel ${isAnyScorePickerOpen ? 'score-picker-open' : ''}`}>
        <button
          className="kanban-details-panel-close"
          onClick={closePanel}
          aria-label="Close panel"
          type="button"
        >
          ×
        </button>
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
          </div>
          <div className="scrollable-content">
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
                onScorePickerVisibilityChange={setIsAnyScorePickerOpen}
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
  </>
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

  // Calculate match statistics
  const getMatchDuration = () => {
    if (!fixture.startedTime || !fixture.actualEndedTime) return null;
    const start = new Date(`1970-01-01T${fixture.actualStartedTime || fixture.startedTime}`);
    const end = new Date(`1970-01-01T${fixture.actualEndedTime}`);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDelayMinutes = () => {
    if (!fixture.scheduledTime || !fixture.startedTime) return null;
    const scheduled = new Date(`1970-01-01T${fixture.scheduledTime}`);
    const actual = new Date(`1970-01-01T${fixture.startedTime}`);
    const diffMs = actual - scheduled;
    return Math.floor(diffMs / 60000);
  };

  const getMatchIntensity = () => {
    if (!hasGoalsPoints) return null;
    const total1 = fixture.goals1 * 3 + fixture.points1;
    const total2 = fixture.goals2 * 3 + fixture.points2;
    const diff = Math.abs(total1 - total2);
    const totalScore = total1 + total2;

    if (diff === 0) return { label: 'Nail-biter! 🤏', color: '#ef4444', icon: '⚡' };
    if (diff <= 3) return { label: 'Close call! 😅', color: '#f97316', icon: '🔥' };
    if (totalScore >= 40) return { label: 'Goal fest! 🎉', color: '#22c55e', icon: '🚀' };
    if (totalScore >= 25) return { label: 'Action packed! 💪', color: '#3b82f6', icon: '💥' };
    return { label: 'Tactical battle 🧠', color: '#6b7280', icon: '⚔️' };
  };

  const getStageEmoji = () => {
    const stage = fixture.stage?.toLowerCase() || '';
    if (stage.includes('final')) return '🏆';
    if (stage.includes('semi')) return '⚔️';
    if (stage.includes('quarter')) return '🎯';
    if (stage.includes('group')) return '📊';
    if (stage.includes('plate')) return '🥉';
    if (stage.includes('shield')) return '🛡️';
    if (stage.includes('cup')) return '🏅';
    return '🏐';
  };

  const getCardCounts = () => {
    if (!fixture.cards || fixture.cards.length === 0) return null;
    const yellowCards = fixture.cards.filter(c => c.cardType === 'yellow' || c.cardType === 'Y').length;
    const redCards = fixture.cards.filter(c => c.cardType === 'red' || c.cardType === 'R').length;
    const blackCards = fixture.cards.filter(c => c.cardType === 'black' || c.cardType === 'B').length;
    return { yellowCards, redCards, blackCards };
  };

  const getPlannedDurationText = () => {
    const duration = fixture.durationPlanned;
    if (!duration || duration <= 0) return null;
    
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    
    // Format the main duration
    let durationText;
    if (hours > 0) {
      durationText = `${hours}h${mins > 0 ? mins + 'm' : ''}`;
    } else {
      durationText = `${mins}m`;
    }
    
    // Calculate halves (assuming 2 equal halves)
    const halfDuration = Math.floor(duration / 2);
    const halfHours = Math.floor(halfDuration / 60);
    const halfMins = halfDuration % 60;
    
    let halfText;
    if (halfHours > 0) {
      halfText = `${halfHours}h${halfMins > 0 ? halfMins + 'm' : ''}`;
    } else {
      halfText = `${halfMins}m`;
    }
    
    return `Duration ${durationText} (2x ${halfText} halves)`;
  };

  const matchDuration = getMatchDuration();
  const delayMinutes = getDelayMinutes();
  const intensity = getMatchIntensity();
  const stageEmoji = getStageEmoji();
  const cardCounts = getCardCounts();
  const isFinished = fixture.outcome === 'played' || fixture.lane?.current === 'finished';
  const isStarted = fixture.startedTime && !isFinished;

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
          ) : null
      }

      {/* Enhanced Details Section */}
      <div className="fixture-details-enhanced">
        {/* Match Status Banner */}
        <div className="match-status-banner">
          <span className="stage-badge">{stageEmoji} {fixture.stage || 'Match'}</span>
          {intensity && isFinished && (
            <span className="intensity-badge" style={{ backgroundColor: intensity.color + '20', color: intensity.color, borderColor: intensity.color }}>
              {intensity.icon} {intensity.label}
            </span>
          )}
        </div>

        {/* Time & Duration Grid */}
        <div className="details-grid-enhanced">
          {fixture.pitch && (
            <div className="detail-card">
              <div className="detail-icon">🏟️</div>
              <div className="detail-content">
                <div className="detail-label">Pitch</div>
                <div className="detail-value">{fixture.pitch}</div>
              </div>
            </div>
          )}

          {getPlannedDurationText() && (
            <div className="detail-card duration-planned">
              <div className="detail-icon">⏱️</div>
              <div className="detail-content">
                <div className="detail-value" style={{ fontSize: '1.3rem' }}>{getPlannedDurationText()}</div>
              </div>
            </div>
          )}

          {delayMinutes !== null && delayMinutes > 0 && (
            <div className="detail-card delay-warning">
              <div className="detail-icon">⏰</div>
              <div className="detail-content">
                <div className="detail-label">Started Late</div>
                <div className="detail-value">+{delayMinutes} min</div>
              </div>
            </div>
          )}

          {delayMinutes !== null && delayMinutes <= 0 && (
            <div className="detail-card on-time">
              <div className="detail-icon">✅</div>
              <div className="detail-content">
                <div className="detail-label">Started</div>
                <div className="detail-value">On time!</div>
              </div>
            </div>
          )}

          {matchDuration && (
            <div className="detail-card">
              <div className="detail-icon">⏱️</div>
              <div className="detail-content">
                <div className="detail-label">Duration</div>
                <div className="detail-value">{matchDuration}</div>
              </div>
            </div>
          )}

          {isStarted && !matchDuration && (
            <div className="detail-card live">
              <div className="detail-icon">🔴</div>
              <div className="detail-content">
                <div className="detail-label">Status</div>
                <div className="detail-value">In Progress</div>
              </div>
            </div>
          )}

          {cardCounts && (cardCounts.yellowCards > 0 || cardCounts.redCards > 0 || cardCounts.blackCards > 0) && (
            <div className="detail-card cards">
              <div className="detail-icon">🃏</div>
              <div className="detail-content">
                <div className="detail-label">Discipline</div>
                <div className="detail-value cards-row">
                  {cardCounts.yellowCards > 0 && <span className="card-count yellow">🟨 {cardCounts.yellowCards}</span>}
                  {cardCounts.redCards > 0 && <span className="card-count red">🟥 {cardCounts.redCards}</span>}
                  {cardCounts.blackCards > 0 && <span className="card-count black">⬛ {cardCounts.blackCards}</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fun Match Facts */}
        {isFinished && hasGoalsPoints && (
          <div className="match-facts">
            <div className="fact-title">📊 Match Insights</div>
            <div className="fact-grid">
              <div className="fact-item">
                <span className="fact-label">Total Score</span>
                <span className="fact-value">{(fixture.goals1 * 3 + fixture.points1) + (fixture.goals2 * 3 + fixture.points2)} pts</span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Goals Scored</span>
                <span className="fact-value">{fixture.goals1 + fixture.goals2} 🥅</span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Points Scored</span>
                <span className="fact-value">{fixture.points1 + fixture.points2} 🎯</span>
              </div>
              <div className="fact-item">
                <span className="fact-label">Margin</span>
                <span className="fact-value">{Math.abs((fixture.goals1 * 3 + fixture.points1) - (fixture.goals2 * 3 + fixture.points2))} pts</span>
              </div>
            </div>
          </div>
        )}

        {/* Historical Context */}
        <div className="historical-context">
          <div className="context-title">🏆 Tournament Context</div>
          <div className="context-content">
            <p>
              <strong>{fixture.category}</strong> • Group {fixture.groupNumber || 'TBD'}
            </p>
            {fixture.scheduledTime && (
              <p className="scheduled-time">
                Originally scheduled for <strong>{fixture.scheduledTime}</strong>
              </p>
            )}
            {isFinished && (
              <p className="completion-message">
                ✅ Match completed {fixture.actualEndedTime ? `at ${fixture.actualEndedTime}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>

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

function ScoreEntryWrapper({ fixture, closePanel, moveToNextFixture, onScorePickerVisibilityChange }) {
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
  const [isScorePickerOpen, setIsScorePickerOpen] = useState(false);

  useEffect(() => {
    onScorePickerVisibilityChange && onScorePickerVisibilityChange(isScorePickerOpen);
  }, [isScorePickerOpen, onScorePickerVisibilityChange]);

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
    <div className="score-entry-container">
      <TabScore
        fixture={fixture}
        scores={scores}
        setScores={setScores}
        onProceed={null} // Remove single proceed, we'll add buttons below
        isSubmitting={isSubmitting}
        onScorePickerVisibilityChange={setIsScorePickerOpen}
      />
      {!isScorePickerOpen && <div className="score-action-buttons">
        <button
          className="btn btn-secondary"
          onClick={handleUpdateScore}
          disabled={isSubmitting}
        >
          <i className="pi pi-pencil button-icon" aria-hidden="true" />
          Update Score
        </button>
        <button
          className="btn btn-primary"
          onClick={handleFinalScore}
          disabled={isSubmitting}
        >
          <i className="pi pi-check-circle button-icon" aria-hidden="true" />
          Final Score
        </button>
        <button
          className="btn btn-warning"
          onClick={handleEndMatch}
          disabled={isSubmitting}
        >
          <i className="pi pi-stop-circle button-icon" aria-hidden="true" />
          End Match
        </button>
      </div>}
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
  const [currentStep, setCurrentStep] = useState(1);
  const tournamentId = fixture.tournamentId;

  const placementOptions = [
    { value: 'before', icon: '⬆️', label: 'Before' },
    { value: 'after', icon: '⬇️', label: 'After' },
    { value: 'swap', icon: '🔀', label: 'Swap' },
  ];

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

  const handlePitchSelect = (pitch) => {
    setSelectedPitch(pitch);
    setTimeout(() => setCurrentStep(2), 500);
  };

  const handlePlacementSelect = (placementValue) => {
    setPlacement(placementValue);
    setTimeout(() => setCurrentStep(3), 500);
  };

  const handleFixtureSelect = (option) => {
    setTargetFixtureId(option?.value || null);
    if (option?.value) {
      setTimeout(() => setCurrentStep(4), 500);
    }
  };

  const selectedPlacement = placementOptions.find(opt => opt.value === placement);
  const selectedFixture = selectOptions.find(opt => opt.value === targetFixtureId);

  const formatOptionLabel = ({ meta }) => (
    <div className="move-option-label">
      <span className="move-option-time">{meta.scheduledTime || meta.plannedStart || 'TBD'}</span>
      <span className="move-option-vs">{`${meta.team1} vs ${meta.team2}`}</span>
    </div>
  );

  return (
    <div className="move-entry-wrapper">
      <header className="move-entry-header">
        <h3>Relocate Fixture</h3>
      </header>

      {errorMessage && (
        <div className="move-entry-alert" role="alert">{errorMessage}</div>
      )}

      {/* Summary Row */}
      <div className="move-summary-row">
        <button 
          className={`summary-item ${currentStep === 1 ? 'editing' : selectedPitch ? 'completed' : ''}`}
          onClick={() => setCurrentStep(1)}
        >
          <span className="summary-label">Pitch</span>
          <span className="summary-value">{selectedPitch || 'Select...'}</span>
          <span className="edit-hint">{selectedPitch && currentStep !== 1 ? '✎' : '\u00A0'}</span>
        </button>
        
        <span className="summary-arrow">→</span>
        
        <button 
          className={`summary-item ${currentStep === 2 ? 'editing' : placement ? 'completed' : ''} ${!selectedPitch ? 'disabled' : ''}`}
          onClick={() => selectedPitch && setCurrentStep(2)}
          disabled={!selectedPitch}
        >
          <span className="summary-label">Placement</span>
          <span className="summary-value">{selectedPlacement?.label || 'Select...'}</span>
          <span className="edit-hint">{placement && currentStep !== 2 ? '✎' : '\u00A0'}</span>
        </button>
        
        <span className="summary-arrow">→</span>
        
        <button 
          className={`summary-item ${(currentStep === 3 || currentStep === 4) ? 'editing' : targetFixtureId ? 'completed' : ''} ${!placement ? 'disabled' : ''}`}
          onClick={() => placement && setCurrentStep(3)}
          disabled={!placement}
        >
          <span className="summary-label">Match</span>
          <span className="summary-value">{selectedFixture ? (selectedFixture.meta.scheduledTime || selectedFixture.meta.plannedStart || 'TBD') : 'Select...'}</span>
          <span className="edit-hint">{targetFixtureId && currentStep !== 3 ? '✎' : '\u00A0'}</span>
        </button>
      </div>

      {/* Step Content */}
      <div className="move-entry-card">
        {/* Step 1: Destination Pitch */}
        {currentStep === 1 && (
          <div className="wizard-step-content">
            <h4 className="wizard-step-title">Select Destination Pitch</h4>
            <div className="pitch-selector-grid">
              {isLoading ? (
                <div className="loading-state">Loading pitches...</div>
              ) : (
                pitches.map((pitch) => (
                  <button
                    key={pitch}
                    type="button"
                    className={`pitch-grid-option ${selectedPitch === pitch ? 'selected' : ''}`}
                    onClick={() => handlePitchSelect(pitch)}
                  >
                    <span className="pitch-grid-icon">🏟️</span>
                    <span className="pitch-grid-name">{pitch}</span>
                    <span className="pitch-check">{selectedPitch === pitch ? '✓' : ''}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2: Placement */}
        {currentStep === 2 && (
          <div className="wizard-step-content">
            <h4 className="wizard-step-title">Select Placement</h4>
            <div className="placement-grid-3col">
              {placementOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`placement-grid-card ${placement === option.value ? 'selected' : ''}`}
                  onClick={() => handlePlacementSelect(option.value)}
                >
                  <span className="placement-grid-check">{placement === option.value ? '✓' : ''}</span>
                  <span className="placement-grid-icon">{option.icon}</span>
                  <span className="placement-grid-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Anchor Fixture */}
        {currentStep === 3 && (
          <div className="wizard-step-content">
            <h4 className="wizard-step-title">Select Anchor Match</h4>
            {fixturesOnSelectedPitch.length === 0 ? (
              <div className="no-fixtures-message">
                <p>No other matches available on {selectedPitch}</p>
              </div>
            ) : (
              <div className="fixture-grid-container">
                {selectOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`fixture-grid-card ${targetFixtureId === option.value ? 'selected' : ''}`}
                    onClick={() => handleFixtureSelect(option)}
                  >
                    <span className="fixture-grid-check">{targetFixtureId === option.value ? '✓' : ''}</span>
                    <span className="fixture-grid-time">{option.meta.scheduledTime || option.meta.plannedStart || 'TBD'}</span>
                    <span className="fixture-grid-teams">{option.meta.team1} vs {option.meta.team2}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="wizard-step-content">
            <h4 className="wizard-step-title">Review & Submit</h4>
            <div className="review-summary">
              <div className="review-row">
                <div className="review-item">
                  <span className="review-label">Pitch</span>
                  <span className="review-value">{selectedPitch}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Placement</span>
                  <span className="review-value">{selectedPlacement?.icon} {selectedPlacement?.label}</span>
                </div>
              </div>
              <div className="review-item review-item-full">
                <span className="review-label">Anchor Match</span>
                <span className="review-value">
                  <span className="review-time">{selectedFixture?.meta?.scheduledTime || selectedFixture?.meta?.plannedStart || 'TBD'}</span>
                  <span className="review-teams">{selectedFixture?.meta?.team1} vs {selectedFixture?.meta?.team2}</span>
                </span>
              </div>
            </div>
            <div className="review-actions">
              <button type="button" className="btn btn-tertiary" onClick={closePanel}>
                <i className="pi pi-times" /> Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!canSubmit || isLoading || isSaving}
                onClick={handleSubmit}
              >
                <i className="pi pi-check" /> {isSaving ? 'Moving…' : 'Apply Move'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions only show on steps 1-3 */}
      {currentStep !== 4 && (
        <div className="move-entry-actions">
          <button type="button" className="btn btn-tertiary" onClick={closePanel}>
            <i className="pi pi-times" /> Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={true}
            onClick={handleSubmit}
          >
            <i className="pi pi-check" /> Apply Move
          </button>
        </div>
      )}
    </div>
  );
}
