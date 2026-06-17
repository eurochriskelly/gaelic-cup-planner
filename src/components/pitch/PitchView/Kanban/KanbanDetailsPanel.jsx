import { useState, useEffect, useRef, useMemo } from "react"; // Added useMemo
import "./KanbanDetailsPanel.scss";
import FixtureBar from "./FixtureBar";
import { useFixtureContext } from "../../PitchView/FixturesContext";
import {
  formatTeamName,
  militaryTimeDiffMins,
} from "../../../../shared/generic/TeamNameDisplay";
import ClockIcon from "../../../../shared/generic/ClockIcon";
import API from "../../../../shared/api/endpoints"; // Import API
import ScoreIcon from "../../../../shared/icons/icon-score.svg?react";
import CardIcon from "../../../../shared/icons/icon-card-textless.svg?react";
import CancelIcon from "../../../../shared/icons/icon-notplayed-textless.svg?react";
import StartIcon from "../../../../shared/icons/icon-start.svg?react";
import MoveIcon from "../../../../shared/icons/icon-move.svg?react";
import EditIcon from "../../../../shared/icons/icon-edit.svg?react";
import "../../../../components/web/gaelic-score";
import "../../../../components/web/logo-box";
import "../../../../components/web/team-name";
import TabCancel from "../UpdateFixture/DialogUpdate/TabCancel";
import TabScore from "../UpdateFixture/DialogUpdate/TabScore"; // Import TabScore
import TabCards from "../UpdateFixture/DialogUpdate/TabCards"; // Import TabCards
import EditFixtureWrapper from "./EditFixtureWrapper"; // Import EditFixtureWrapper

const KanbanDetailsPanel = ({
  fixture,
  mode = "info",
  closePanel,
  moveToNextFixture, // Accept moveToNextFixture
}) => {
  if (!fixture) return null;
  const [isAnyScorePickerOpen, setIsAnyScorePickerOpen] = useState(false);
  const [activeMode, setActiveMode] = useState(mode);
  const { startMatch, fetchFixtures } = useFixtureContext();

  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  const handleStartMatch = async () => {
    try {
      await startMatch(fixture.id);
      await fetchFixtures(true);
      setActiveMode("score");
    } catch (error) {
      console.error("Error starting match:", error);
    }
  };

  const displayCategory = fixture.category
    ? fixture.category.substring(0, 9).toUpperCase()
    : "";
  const displayStage = fixture.stage
    ? fixture.stage
        .toUpperCase()
        .replace("PLT", "Plate")
        .replace("CUP", "Cup")
        .replace("SHD", "Shield")
        .replace("_", "/")
    : "";

  // Check if all score values are valid

  return (
    <>
      <div className="kanban-details-panel-backdrop" onClick={closePanel} />
      <div
        className={`kanban-details-panel ${
          isAnyScorePickerOpen ? "score-picker-open" : ""
        }`}
      >
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
          number={fixture.groupNumber || "0"}
          competitionPrefix={fixture?.competition?.initials}
          competitionOffset={fixture?.competition?.offset}
        />

        <div className="details-content-wrapper">
          <section className="mt-7 mr-0 pr-0">
            <div className="fixture-time-row">
              <ClockIcon
                scheduled={fixture.scheduledTime || fixture.plannedStart}
                started={fixture.startedTime || fixture.actualStartedTime}
                delay={militaryTimeDiffMins(
                  fixture.scheduledTime || fixture.plannedStart,
                  fixture.startedTime || fixture.actualStartedTime
                )}
                played={!!fixture.startedTime || !!fixture.actualStartedTime}
                size={78}
              />
            </div>

            <div className="fixture-match-header">
              <div className="match-up">
                <div className="match-team match-team-1">
                  <logo-box
                    title={fixture.team1 || "TBD"}
                    size="88px"
                    border-color="#e11d48"
                  ></logo-box>
                  <span>{formatTeamName(fixture.team1 || "TBD")}</span>
                </div>
                <div className="match-versus">vs.</div>
                <div className="match-team match-team-2">
                  <span>{formatTeamName(fixture.team2 || "TBD")}</span>
                  <logo-box
                    title={fixture.team2 || "TBD"}
                    size="88px"
                    border-color="#38bdf8"
                  ></logo-box>
                </div>
              </div>
            </div>
            <FixtureActionTabs
              fixture={fixture}
              activeMode={activeMode}
              onSetMode={setActiveMode}
              onStartMatch={handleStartMatch}
            />
            <div className="scrollable-content">
              {activeMode === "info" && (
                <ShowFixtureDetails fixture={fixture} />
              )}
              {activeMode === "forfeit" && (
                <ShowForfeitOptions fixture={fixture} closePanel={closePanel} />
              )}
              {activeMode === "cards" && (
                <CardEntryWrapper fixture={fixture} closePanel={closePanel} />
              )}
              {activeMode === "score" && (
                <ScoreEntryWrapper
                  fixture={fixture}
                  closePanel={closePanel}
                  moveToNextFixture={moveToNextFixture}
                  onScorePickerVisibilityChange={setIsAnyScorePickerOpen}
                />
              )}
              {activeMode === "move" && (
                <MoveFixtureWrapper fixture={fixture} closePanel={closePanel} />
              )}
              {activeMode === "edit" && (
                <EditFixtureWrapper fixture={fixture} closePanel={closePanel} />
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default KanbanDetailsPanel;

function FixtureActionTabs({ fixture, activeMode, onSetMode, onStartMatch }) {
  const lane = fixture?.lane?.current;
  const orderByLane = {
    planned: ["info", "cancel", "reschedule", "edit"],
    queued: ["info", "start", "cancel", "reschedule"],
    started: ["info", "finish", "cards", "cancel"],
    finished: ["info", "cards", "cancel"],
  };
  const order = orderByLane[lane] || orderByLane.started;

  const tabMeta = {
    info: { label: "Info", Icon: InfoIcon, mode: "info" },
    finish: { label: "Score", Icon: ScoreIcon, mode: "score" },
    cards: { label: "Card", Icon: CardIcon, mode: "cards" },
    cancel: { label: "Not Played", Icon: CancelIcon, mode: "forfeit" },
    start: { label: "Start", Icon: StartIcon, mode: null },
    reschedule: { label: "Move", Icon: MoveIcon, mode: "move" },
    edit: { label: "Edit", Icon: EditIcon, mode: "edit" },
  };

  const tabs = order
    .map((id) => ({ id, ...tabMeta[id] }))
    .filter((tab) => tab.Icon);

  return (
    <div
      className="fixture-action-tabs"
      role="tablist"
      aria-label="Fixture actions"
    >
      {tabs.map(({ id, label, Icon, mode }) => {
        const isActive = activeMode === mode;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`fixture-action-tab ${isActive ? "active" : ""}`}
            onClick={() => {
              if (id === "start") {
                onStartMatch();
                return;
              }
              if (mode) onSetMode(mode);
            }}
          >
            <Icon className="fixture-action-tab__icon" />
            <span className="fixture-action-tab__label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function InfoIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 10 10"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="fg"
        fill="currentColor"
        fillRule="evenodd"
        d="M5 1.9a2.85 2.85 0 1 0 0 5.7 2.85 2.85 0 0 0 0-5.7Zm0 .58a2.27 2.27 0 1 1 0 4.54 2.27 2.27 0 0 1 0-4.54Zm-.3 2h.6v1.85h-.6V4.48Zm0-1.05h.6v.62h-.6v-.62Z"
      />
    </svg>
  );
}

function ShowFixtureDetails({ fixture }) {
  const hasScores = fixture.score1 || fixture.score2;
  const hasGoalsPoints =
    typeof fixture.goals1 === "number" &&
    typeof fixture.goals2 === "number" &&
    typeof fixture.points1 === "number" &&
    typeof fixture.points2 === "number";

  const getMatchDuration = () => {
    const startedTime = fixture.actualStartedTime || fixture.startedTime;
    if (!startedTime || !fixture.actualEndedTime) return null;
    const start = new Date(`1970-01-01T${startedTime}`);
    const end = new Date(`1970-01-01T${fixture.actualEndedTime}`);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDelayMinutes = () => {
    const scheduledTime = fixture.scheduledTime || fixture.plannedStart;
    const startedTime = fixture.startedTime || fixture.actualStartedTime;
    if (!scheduledTime || !startedTime) return null;
    const scheduled = new Date(`1970-01-01T${scheduledTime}`);
    const actual = new Date(`1970-01-01T${startedTime}`);
    const diffMs = actual - scheduled;
    return Math.floor(diffMs / 60000);
  };

  const getCardCounts = () => {
    if (!fixture.cards || fixture.cards.length === 0) return null;
    const yellowCards = fixture.cards.filter(
      (c) => c.cardType === "yellow" || c.cardType === "Y"
    ).length;
    const redCards = fixture.cards.filter(
      (c) => c.cardType === "red" || c.cardType === "R"
    ).length;
    const blackCards = fixture.cards.filter(
      (c) => c.cardType === "black" || c.cardType === "B"
    ).length;
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
      durationText = `${hours}h${mins > 0 ? mins + "m" : ""}`;
    } else {
      durationText = `${mins}m`;
    }

    // Calculate halves (assuming 2 equal halves)
    const halfDuration = Math.floor(duration / 2);
    const halfHours = Math.floor(halfDuration / 60);
    const halfMins = halfDuration % 60;

    let halfText;
    if (halfHours > 0) {
      halfText = `${halfHours}h${halfMins > 0 ? halfMins + "m" : ""}`;
    } else {
      halfText = `${halfMins}m`;
    }

    return `${durationText} (2 x ${halfText} halves)`;
  };

  const getStageText = () => {
    if (!fixture.stage && !fixture.groupNumber) return null;

    const stage = `${fixture.stage || ""}`
      .replace("_", " ")
      .trim()
      .toLowerCase();
    const stageText = stage
      ? stage.charAt(0).toUpperCase() + stage.slice(1)
      : "Group";

    if (stage.includes("group") && fixture.groupNumber) {
      return `${stageText} ${fixture.groupNumber}`;
    }

    return stageText;
  };

  const getCardsText = () => {
    const cardCounts = getCardCounts();
    if (
      !cardCounts ||
      (!cardCounts.yellowCards &&
        !cardCounts.redCards &&
        !cardCounts.blackCards)
    ) {
      return null;
    }

    return [
      cardCounts.yellowCards ? `${cardCounts.yellowCards} yellow` : null,
      cardCounts.redCards ? `${cardCounts.redCards} red` : null,
      cardCounts.blackCards ? `${cardCounts.blackCards} black` : null,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const matchDuration = getMatchDuration();
  const delayMinutes = getDelayMinutes();
  const isFinished =
    fixture.outcome === "played" || fixture.lane?.current === "finished";
  const isStarted = fixture.startedTime && !isFinished;
  const normalizedOutcome = `${fixture.outcome || ""}`
    .toLowerCase()
    .replace(/[-_\s]/g, "");
  const total1 = hasGoalsPoints ? fixture.goals1 * 3 + fixture.points1 : null;
  const total2 = hasGoalsPoints ? fixture.goals2 * 3 + fixture.points2 : null;
  const statusText = isFinished
    ? "Completed"
    : isStarted
    ? "In progress"
    : normalizedOutcome === "notplayed"
    ? "Not played"
    : "Scheduled";
  const primaryInfoRows = [
    { label: "Stage", value: getStageText() },
    { label: "Pitch", value: fixture.pitch },
    { label: "Umpires", value: fixture.umpireTeam },
  ].filter(({ value }) => value);

  const secondaryInfoRows = [
    { label: "Status", value: statusText },
    { label: "Scheduled", value: fixture.scheduledTime },
    {
      label: "Started",
      value: fixture.startedTime || fixture.actualStartedTime,
    },
    { label: "Ended", value: fixture.actualEndedTime },
    { label: "Duration", value: getPlannedDurationText() },
    { label: "Actual", value: matchDuration },
    {
      label: "Delay",
      value:
        delayMinutes !== null
          ? delayMinutes > 0
            ? `+${delayMinutes} min`
            : "On time"
          : null,
    },
    { label: "Cards", value: getCardsText() },
  ].filter(({ value }) => value);

  return (
    <>
      {hasGoalsPoints ? (
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
          <div className="team-score">{fixture.score1 || "?-??"}</div>
          <div></div>
          <div className="team-score">{fixture.score2 || "?-??"}</div>
          <div></div>
        </div>
      ) : null}

      <div className="fixture-details-summary">
        <FixtureInfoList rows={primaryInfoRows} />

        {secondaryInfoRows.length > 0 && (
          <FixtureInfoList rows={secondaryInfoRows} isSecondary />
        )}

        {isFinished && hasGoalsPoints && (
          <div className="fixture-match-summary" aria-label="Match summary">
            <span>Total {total1 + total2} pts</span>
            <span>Goals {fixture.goals1 + fixture.goals2}</span>
            <span>Points {fixture.points1 + fixture.points2}</span>
            <span>Margin {Math.abs(total1 - total2)} pts</span>
          </div>
        )}

        {fixture.category && (
          <div className="fixture-context-note">
            {fixture.category}
            {fixture.groupNumber ? ` - Group ${fixture.groupNumber}` : ""}
          </div>
        )}
      </div>
    </>
  );
}

function FixtureInfoList({ rows }) {
  return (
    <dl className="fixture-details-list">
      {rows.map(({ label, value }) => (
        <div className="fixture-details-row" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ShowForfeitOptions({
  fixture,
  closePanel, // Receive closePanel prop
}) {
  const { fetchFixtures } = useFixtureContext();
  const [cancellationOption, setCancellationOption] = useState(null);

  const handleForfeitConfirm = () => {
    fetchFixtures(); // Refresh data from context
    closePanel(); // Close the details panel
  };

  const handleForfeitClose = () => {
    // cancellationOption is reset within TabCancel before it calls onClose
    closePanel(); // Close the details panel
  };

  if (!fixture) return null;

  return (
    <div className="forfeit-options-container" style={{ marginTop: "2rem" }}>
      {" "}
      {/* Added a wrapper and some margin */}
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

function ScoreEntryWrapper({
  fixture,
  closePanel,
  moveToNextFixture,
  onScorePickerVisibilityChange,
}) {
  const { fetchFixtures } = useFixtureContext();
  const [scores, setScores] = useState({
    team1: {
      goals: fixture.goals1 !== undefined ? fixture.goals1 : null,
      points: fixture.points1 !== undefined ? fixture.points1 : null,
      goalsExtra:
        fixture.goals1Extra !== undefined ? fixture.goals1Extra : null,
      pointsExtra:
        fixture.points1Extra !== undefined ? fixture.points1Extra : null,
      goalsPenalties:
        fixture.goals1Penalties !== undefined ? fixture.goals1Penalties : null,
      pointsPenalties:
        fixture.points1Penalties !== undefined
          ? fixture.points1Penalties
          : null,
    },
    team2: {
      goals: fixture.goals2 !== undefined ? fixture.goals2 : null,
      points: fixture.points2 !== undefined ? fixture.points2 : null,
      goalsExtra:
        fixture.goals2Extra !== undefined ? fixture.goals2Extra : null,
      pointsExtra:
        fixture.points2Extra !== undefined ? fixture.points2Extra : null,
      goalsPenalties:
        fixture.goals2Penalties !== undefined ? fixture.goals2Penalties : null,
      pointsPenalties:
        fixture.points2Penalties !== undefined
          ? fixture.points2Penalties
          : null,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEndMatchWarning, setShowEndMatchWarning] = useState(false);
  const [isScorePickerOpen, setIsScorePickerOpen] = useState(false);
  const [showExtraOptions, setShowExtraOptions] = useState(false);

  useEffect(() => {
    onScorePickerVisibilityChange &&
      onScorePickerVisibilityChange(isScorePickerOpen);
  }, [isScorePickerOpen, onScorePickerVisibilityChange]);

  // Check if normal time scores are entered for both teams
  const isScoreValueSet = (value) =>
    value !== null && value !== undefined && value !== "";
  const hasBothScores =
    isScoreValueSet(scores.team1.goals) &&
    isScoreValueSet(scores.team1.points) &&
    isScoreValueSet(scores.team2.goals) &&
    isScoreValueSet(scores.team2.points);

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
        outcome: "played",
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
        outcome: "played",
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
      {!isScorePickerOpen && hasBothScores && (
        <div className="score-action-buttons">
          <button
            className={`btn btn-primary publish-score-button ${
              !showExtraOptions ? "btn-full-width" : ""
            }`}
            onClick={handleFinalScore}
            disabled={isSubmitting}
          >
            <i className="pi pi-check-circle button-icon" aria-hidden="true" />
            Publish Final Score
          </button>

          {showExtraOptions && (
            <>
              <button
                className="btn btn-secondary"
                onClick={handleUpdateScore}
                disabled={isSubmitting}
              >
                <i className="pi pi-pencil button-icon" aria-hidden="true" />
                Update Score
              </button>
              <button
                className="btn btn-warning"
                onClick={handleEndMatch}
                disabled={isSubmitting}
              >
                <i
                  className="pi pi-stop-circle button-icon"
                  aria-hidden="true"
                />
                End Match
              </button>
            </>
          )}
        </div>
      )}

      {!isScorePickerOpen && hasBothScores && (
        <div className="extra-options-toggle-container">
          <label className="extra-options-toggle">
            <input
              type="checkbox"
              checked={showExtraOptions}
              onChange={(e) => setShowExtraOptions(e.target.checked)}
            />
            <span>Show extra options</span>
          </label>
        </div>
      )}
      {showEndMatchWarning && (
        <div className="reschedule-message-overlay">
          <div className="reschedule-message">
            <div className="warning-icon">⚠️</div>
            <div className="warning-message">
              This will end the match without a score, freeing up the pitch for
              other teams. Are you sure?
            </div>
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
        team1: fixture.cards.filter((p) => p.team === fixture.team1),
        team2: fixture.cards.filter((p) => p.team === fixture.team2),
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
        team1: fixture.cards.filter((p) => p.team === fixture.team1),
        team2: fixture.cards.filter((p) => p.team === fixture.team2),
      };
      setCardedPlayers(res);
    } else {
      setCardedPlayers({ team1: [], team2: [] });
    }
  }, [fixture.cards, fixture.team1, fixture.team2]); // Removed setCardedPlayers from deps as it's stable

  // Effect to initialize/update syncedCardedPlayersRef when fixture.cards (the source of truth) changes
  useEffect(() => {
    if (fixture.cards && Array.isArray(fixture.cards)) {
      syncedCardedPlayersRef.current = {
        team1: fixture.cards.filter(
          (p) =>
            p.team === fixture.team1 &&
            p.id &&
            !(typeof p.id === "number" && p.id > 1000000)
        ),
        team2: fixture.cards.filter(
          (p) =>
            p.team === fixture.team2 &&
            p.id &&
            !(typeof p.id === "number" && p.id > 1000000)
        ),
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
      console.log("Debounced persistCardChanges triggered...");
      const currentCardsTeam1 = cardedPlayers.team1 || [];
      const currentCardsTeam2 = cardedPlayers.team2 || [];
      const syncedCardsTeam1 = syncedCardedPlayersRef.current.team1 || [];
      const syncedCardsTeam2 = syncedCardedPlayersRef.current.team2 || [];

      const playersToUpdate = [];

      const findAndCompareCard = (currentCard, syncedTeamCards) => {
        // Only consider cards with real IDs (not temporary ones) for update
        if (
          !currentCard.id ||
          (typeof currentCard.id === "number" && currentCard.id > 1000000)
        ) {
          return null;
        }
        const syncedCard = syncedTeamCards.find(
          (sc) => sc.id === currentCard.id
        );

        if (!syncedCard) {
          // This card is in current state with a real ID but not in our last synced snapshot.
          // This could happen if it was just added and syncedRef hasn't updated yet.
          // For an auto-save of *modifications*, we should only update cards that were previously known (synced).
          // Additions are handled by TabCards' explicit save.
          return null;
        }

        // Compare relevant editable properties
        if (
          currentCard.player !== syncedCard.player ||
          currentCard.cardType !== syncedCard.cardType ||
          currentCard.notes !== syncedCard.notes ||
          currentCard.number !== syncedCard.number // Assuming 'number' (jersey) is editable
        ) {
          return currentCard; // This card has changed
        }
        return null; // No changes detected for this card
      };

      currentCardsTeam1.forEach((cc) => {
        const changedCard = findAndCompareCard(cc, syncedCardsTeam1);
        if (changedCard) playersToUpdate.push(changedCard);
      });
      currentCardsTeam2.forEach((cc) => {
        const changedCard = findAndCompareCard(cc, syncedCardsTeam2);
        if (changedCard) playersToUpdate.push(changedCard);
      });

      if (playersToUpdate.length > 0) {
        try {
          console.log(
            "Auto-saving updates to specific carded players:",
            playersToUpdate
          );
          for (const player of playersToUpdate) {
            await API.updateCardedPlayer(
              fixture.tournamentId,
              fixture.id,
              player
            );
          }
          console.log(
            "Successfully auto-saved updates to specific carded players."
          );
          // After successful updates, fetchFixtures will refresh the data,
          // which in turn will update fixture.cardedPlayers prop,
          // and the other useEffect will update syncedCardedPlayersRef.current.
          await fetchFixtures(true);
        } catch (error) {
          console.error(
            "Error auto-saving updates to specific carded players:",
            error
          );
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

    if (cardDataFromTab.action === "delete") {
      const cardIdToDelete = cardDataFromTab.id;
      // Check if the card to delete has a real ID (i.e., it exists on the backend)
      const isRealCard =
        cardIdToDelete &&
        !(typeof cardIdToDelete === "number" && cardIdToDelete > 1000000);

      if (isRealCard) {
        try {
          await API.deleteCardedPlayer(
            tournamentId,
            fixtureId,
            cardDataFromTab
          ); // API expects card object
          // Update local state by removing the card
          setCardedPlayers((prev) => {
            const teamKey =
              cardDataFromTab.team === fixtureTeam1Name ? "team1" : "team2";
            const newTeamCards = (prev[teamKey] || []).filter(
              (c) => c.id !== cardIdToDelete
            );
            return { ...prev, [teamKey]: newTeamCards };
          });
          await fetchFixtures(true); // Refresh all fixture data
        } catch (error) {
          console.error("Error deleting card from backend:", error);
          // TODO: Optionally show an error message to the user
        }
      } else {
        // Card has no real ID (was temporary and not saved to backend), just remove from local state
        setCardedPlayers((prev) => {
          const teamKey =
            cardDataFromTab.team === fixtureTeam1Name ? "team1" : "team2";
          const newTeamCards = (prev[teamKey] || []).filter(
            (c) => c.id !== cardIdToDelete
          ); // cardIdToDelete is temp ID
          return { ...prev, [teamKey]: newTeamCards };
        });
      }
      return;
    }

    // --- Add or Update card ---
    const isExistingCardWithRealId =
      cardDataFromTab.id &&
      !(typeof cardDataFromTab.id === "number" && cardDataFromTab.id > 1000000);

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
      const savedCard = await API.updateCardedPlayer(
        tournamentId,
        fixtureId,
        payload
      );

      setCardedPlayers((prev) => {
        const teamKey = savedCard.team === fixtureTeam1Name ? "team1" : "team2";
        let teamCards = [...(prev[teamKey] || [])];

        if (isExistingCardWithRealId) {
          // It was an update to an existing card
          teamCards = teamCards.map((c) =>
            c.id === savedCard.id ? savedCard : c
          );
        } else {
          // It was a new card that has been created
          // If TabCards passed a temporary ID with the original cardDataFromTab, remove that temporary entry
          if (
            cardDataFromTab.id &&
            typeof cardDataFromTab.id === "number" &&
            cardDataFromTab.id > 1000000
          ) {
            teamCards = teamCards.filter((c) => c.id !== cardDataFromTab.id);
          }
          teamCards.push(savedCard); // Add the newly saved card with its real ID
        }
        return { ...prev, [teamKey]: teamCards };
      });
      await fetchFixtures(true); // Refresh all fixture data to ensure consistency
    } catch (error) {
      console.error("Error saving card (add/update):", error);
      // TODO: Optionally show an error message to the user
    }
  };

  return (
    <div className="card-entry-container" style={{ marginTop: "1rem" }}>
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

function getMoveFixtureTimeLabel(match) {
  return match?.scheduledTime || match?.plannedStart || "TBD";
}

function getMoveFixtureSortKey(match) {
  return match?.scheduledTime || match?.plannedStart || "99:99";
}

function getMoveOrdinalSuffix(number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = number % 100;
  return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
}

function getMoveFixtureTeamText(team) {
  if (!team || team === "~") return "TBD";
  if (typeof team !== "string") return "TBD";

  if (!team.startsWith("~")) {
    return team.toUpperCase();
  }

  const parts = team.replace("~", "").split("/");
  const dependent = parts[0] || "";
  const position = Number((parts[1] || "").replace("p:", ""));
  const [type, order] = dependent.split(":");

  switch (type) {
    case "match":
      return `${position === 1 ? "WINNER" : "LOSER"} OF FIXTURE #${order}`;
    case "semis":
    case "finals":
    case "quarters":
      return `${
        position === 1 ? "WINNER" : "LOSER"
      } OF ${type.toUpperCase()} #${order}`;
    case "group":
      if (position >= 1 && position <= 9) {
        return `${position}${getMoveOrdinalSuffix(
          position
        ).toUpperCase()} IN GP.${order}`;
      }
      return "T.B.D.";
    default:
      return "T.B.D.";
  }
}

function getMoveFixtureTeamsLabel(match) {
  return `${getMoveFixtureTeamText(match?.team1)} vs ${getMoveFixtureTeamText(
    match?.team2
  )}`;
}

function getMoveFixtureCode(match) {
  const prefixSource =
    match?.competition?.initials?.trim() || match?.category?.trim() || "F";
  const prefix = prefixSource[0]?.toUpperCase() || "F";
  const rawId = match?.id == null ? "??" : `${match.id}`;
  const suffix = rawId.length >= 2 ? rawId.slice(-2) : rawId.padStart(2, "0");
  return `${prefix}.${suffix}`;
}

function areMoveFixtureOrdersEqual(left, right) {
  if (left.length !== right.length) return false;

  return left.every((fixtureId, index) => fixtureId === right[index]);
}

function MoveFixtureWrapper({ fixture, closePanel }) {
  const { fetchFixtures } = useFixtureContext();
  const [pitches, setPitches] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selectedPitch, setSelectedPitch] = useState(fixture.pitch || "");
  const [currentStep, setCurrentStep] = useState(1);
  const [previewOrderIds, setPreviewOrderIds] = useState([]);
  const [swapFixtureId, setSwapFixtureId] = useState(null);
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
            if (fixture.pitch && pitchList.includes(fixture.pitch))
              return fixture.pitch;
            return pitchList[0];
          });
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Error loading move options:", error);
        setErrorMessage(
          "Unable to load pitch and fixture information right now."
        );
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

  const orderedPitches = useMemo(() => {
    const availablePitches = [...pitches];

    if (fixture.pitch && !availablePitches.includes(fixture.pitch)) {
      availablePitches.unshift(fixture.pitch);
    }

    return [...new Set(availablePitches.filter(Boolean))].sort(
      (left, right) => {
        if (left === fixture.pitch) return -1;
        if (right === fixture.pitch) return 1;
        return left.localeCompare(right, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }
    );
  }, [pitches, fixture.pitch]);

  const alternatePitches = useMemo(
    () => orderedPitches.filter((pitchName) => pitchName !== fixture.pitch),
    [orderedPitches, fixture.pitch]
  );

  const fixturesOnSelectedPitch = useMemo(() => {
    return fixtures
      .filter((f) => f.id !== fixture.id && f.pitch === selectedPitch)
      .sort((a, b) => {
        const left = getMoveFixtureSortKey(a);
        const right = getMoveFixtureSortKey(b);
        return left.localeCompare(right);
      });
  }, [fixtures, selectedPitch, fixture.id]);

  const selectedPitchFixturesById = useMemo(
    () => new Map(fixturesOnSelectedPitch.map((item) => [item.id, item])),
    [fixturesOnSelectedPitch]
  );

  const initialPreviewOrderIds = useMemo(() => {
    if (!selectedPitch) return [];

    const orderedIds = fixturesOnSelectedPitch.map((item) => item.id);
    const insertionIndex = fixturesOnSelectedPitch.findIndex(
      (item) => getMoveFixtureSortKey(item) > getMoveFixtureSortKey(fixture)
    );

    if (insertionIndex === -1) {
      orderedIds.push(fixture.id);
    } else {
      orderedIds.splice(insertionIndex, 0, fixture.id);
    }

    return orderedIds;
  }, [fixture, fixturesOnSelectedPitch, selectedPitch]);

  useEffect(() => {
    setPreviewOrderIds(initialPreviewOrderIds);
    setSwapFixtureId(null);
    setErrorMessage(null);
    setCurrentStep((prev) => (prev > 2 ? 2 : prev));
  }, [initialPreviewOrderIds]);

  const previewFixtures = useMemo(
    () =>
      previewOrderIds
        .map((fixtureId) =>
          fixtureId === fixture.id
            ? fixture
            : selectedPitchFixturesById.get(fixtureId) || null
        )
        .filter(Boolean),
    [fixture, previewOrderIds, selectedPitchFixturesById]
  );

  const currentPreviewIndex = previewOrderIds.indexOf(fixture.id);
  const currentPitchLabel = fixture.pitch || "current pitch";
  const selectedPitchLabel = selectedPitch || currentPitchLabel;
  const currentFixtureCode = getMoveFixtureCode(fixture);
  const currentTimeLabel = getMoveFixtureTimeLabel(fixture);
  const chosenSwapFixture = swapFixtureId
    ? selectedPitchFixturesById.get(swapFixtureId) || null
    : null;
  const isSameOrderAsInitial = areMoveFixtureOrdersEqual(
    previewOrderIds,
    initialPreviewOrderIds
  );
  const isUnchanged =
    selectedPitch === fixture.pitch && isSameOrderAsInitial && !swapFixtureId;
  const hasReferenceFixture = previewFixtures.length > 1;

  const resolvedMove = useMemo(() => {
    if (!selectedPitch) {
      return { placement: null, targetFixture: null };
    }

    if (swapFixtureId) {
      return {
        placement: "swap",
        targetFixture: chosenSwapFixture,
      };
    }

    if (!hasReferenceFixture || currentPreviewIndex === -1) {
      return { placement: null, targetFixture: null };
    }

    if (currentPreviewIndex === 0) {
      return {
        placement: "before",
        targetFixture: previewFixtures[1] || null,
      };
    }

    return {
      placement: "after",
      targetFixture: previewFixtures[currentPreviewIndex - 1] || null,
    };
  }, [
    chosenSwapFixture,
    currentPreviewIndex,
    hasReferenceFixture,
    previewFixtures,
    selectedPitch,
    swapFixtureId,
  ]);

  const stepTwoHint = useMemo(() => {
    if (!selectedPitch) return "Select a pitch.";

    if (selectedPitch !== fixture.pitch && !hasReferenceFixture) {
      return "This pitch has no other fixtures yet. The current move API still needs a reference fixture.";
    }

    if (!hasReferenceFixture) {
      return `No other fixtures on ${selectedPitchLabel}.`;
    }

    if (swapFixtureId && chosenSwapFixture) {
      return `Swap ${currentFixtureCode} with ${getMoveFixtureCode(
        chosenSwapFixture
      )}.`;
    }

    return "Use the arrows on this fixture to move it one slot at a time.";
  }, [
    chosenSwapFixture,
    currentFixtureCode,
    fixture.pitch,
    hasReferenceFixture,
    selectedPitch,
    selectedPitchLabel,
    swapFixtureId,
  ]);

  const confirmMessage = useMemo(() => {
    if (selectedPitch !== fixture.pitch && !hasReferenceFixture) {
      return "Moving to an empty pitch still needs backend support.";
    }

    return null;
  }, [fixture.pitch, hasReferenceFixture, selectedPitch]);

  const confirmationText = useMemo(() => {
    if (!selectedPitch) return `Fixture ${currentFixtureCode}`;

    if (isUnchanged) {
      return `Fixture ${currentFixtureCode} will stay on ${selectedPitchLabel} at ${currentTimeLabel}.`;
    }

    if (!resolvedMove.targetFixture) {
      return `Fixture ${currentFixtureCode} stays where it is for now.`;
    }

    const referenceCode = getMoveFixtureCode(resolvedMove.targetFixture);

    if (resolvedMove.placement === "swap") {
      return `Fixture ${currentFixtureCode} will swap places with ${referenceCode} on ${selectedPitchLabel}.`;
    }

    if (currentPreviewIndex === 0) {
      return `Fixture ${currentFixtureCode} will move to the top of ${selectedPitchLabel}, before ${referenceCode}.`;
    }

    return `Fixture ${currentFixtureCode} will move after ${referenceCode} on ${selectedPitchLabel}.`;
  }, [
    currentTimeLabel,
    currentFixtureCode,
    currentPreviewIndex,
    isUnchanged,
    resolvedMove,
    selectedPitch,
    selectedPitchLabel,
  ]);

  const canSubmit =
    isUnchanged
      ? Boolean(!isSaving)
      : Boolean(
          selectedPitch &&
            resolvedMove.placement &&
            resolvedMove.targetFixture?.id &&
            !isSaving
        );

  const canReviewMove = isUnchanged
    ? Boolean(selectedPitch)
    : Boolean(
        selectedPitch && resolvedMove.placement && resolvedMove.targetFixture?.id
      );

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (isUnchanged) {
        closePanel();
        return;
      }

      await API.rescheduleMatch(
        fixture.tournamentId,
        selectedPitch,
        fixture.id,
        resolvedMove.targetFixture.id,
        resolvedMove.placement
      );
      await fetchFixtures(true);
      closePanel();
    } catch (error) {
      console.error("Error applying move:", error);
      setErrorMessage("Could not apply the move. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePitchSelect = (pitchName) => {
    setSelectedPitch(pitchName);
    setErrorMessage(null);
  };

  const handleMoveCurrentFixture = (offset) => {
    setPreviewOrderIds((previousOrder) => {
      const fromIndex = previousOrder.indexOf(fixture.id);
      const toIndex = fromIndex + offset;

      if (
        fromIndex === -1 ||
        toIndex < 0 ||
        toIndex >= previousOrder.length
      ) {
        return previousOrder;
      }

      const nextOrder = [...previousOrder];
      [nextOrder[fromIndex], nextOrder[toIndex]] = [
        nextOrder[toIndex],
        nextOrder[fromIndex],
      ];
      return nextOrder;
    });

    setSwapFixtureId(null);
    setErrorMessage(null);
  };

  const handleSwapWithFixture = (fixtureId) => {
    if (fixtureId === fixture.id) return;

    setPreviewOrderIds((previousOrder) => {
      const currentIndex = previousOrder.indexOf(fixture.id);
      const targetIndex = previousOrder.indexOf(fixtureId);

      if (currentIndex === -1 || targetIndex === -1) {
        return previousOrder;
      }

      const nextOrder = [...previousOrder];
      [nextOrder[currentIndex], nextOrder[targetIndex]] = [
        nextOrder[targetIndex],
        nextOrder[currentIndex],
      ];
      return nextOrder;
    });

    setSwapFixtureId((previousSwapId) =>
      previousSwapId === fixtureId ? null : fixtureId
    );
    setErrorMessage(null);
  };

  const handleStepTwoBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="move-entry-wrapper">
      <header className="move-entry-header">
        <h3>Relocate Fixture</h3>
      </header>

      {errorMessage && (
        <div className="move-entry-alert" role="alert">
          {errorMessage}
        </div>
      )}

      {currentStep === 1 && (
        <section className="move-step-card">
          <div className="move-step-heading">
            <span className="move-step-index">Step 1</span>
            <h4>Select pitch</h4>
          </div>

          {isLoading ? (
            <div className="loading-state">Loading pitches...</div>
          ) : (
            <div className="move-pitch-choices">
              <button
                type="button"
                className={`move-pitch-choice move-pitch-choice-primary ${
                  selectedPitch === fixture.pitch ? "selected" : ""
                }`}
                onClick={() => handlePitchSelect(fixture.pitch)}
              >
                Keep same pitch
              </button>

              {alternatePitches.length > 0 && (
                <div className="move-pitch-list">
                  <div className="move-pitch-list-header">Move to pitch</div>
                  <div className="move-pitch-grid">
                    {alternatePitches.map((pitchName) => (
                      <button
                        key={pitchName}
                        type="button"
                        className={`move-pitch-choice ${
                          selectedPitch === pitchName ? "selected" : ""
                        }`}
                        onClick={() => handlePitchSelect(pitchName)}
                      >
                        {pitchName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="move-entry-actions move-entry-actions-single">
            <button
              type="button"
              className="btn btn-primary"
              disabled={isLoading || !selectedPitch}
              onClick={() => setCurrentStep(2)}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {currentStep === 2 && (
        <section className="move-step-card">
          <div className="move-step-heading">
            <span className="move-step-index">Step 2</span>
            <h4>Change scheduled time</h4>
          </div>

          <div className="move-step-meta">{selectedPitchLabel}</div>

          <div className="move-fixture-browser">
            <div className="move-fixture-browser-header">Fixtures</div>

            {isLoading ? (
              <div className="loading-state">Loading fixtures...</div>
            ) : (
              <div className="move-fixture-list">
                {previewFixtures.map((pitchFixture) => {
                  const isCurrentFixture = pitchFixture.id === fixture.id;
                  const isSwapTarget = swapFixtureId === pitchFixture.id;

                  return (
                    <div
                      key={pitchFixture.id}
                      className={`move-fixture-card ${
                        isCurrentFixture ? "current-fixture" : ""
                      } ${isSwapTarget ? "swap-target" : ""}`}
                    >
                      <div className="move-fixture-primary">
                        <span className="move-fixture-time">
                          {getMoveFixtureTimeLabel(pitchFixture)}
                        </span>
                        <div className="move-fixture-summary">
                          <span className="move-fixture-teams">
                            {getMoveFixtureTeamsLabel(pitchFixture)}
                          </span>
                          <div className="move-fixture-meta-row">
                            <span className="move-fixture-code">
                              {getMoveFixtureCode(pitchFixture)}
                            </span>
                            {isCurrentFixture && (
                              <span className="move-current-badge">
                                This fixture
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="move-fixture-actions-row">
                        {isCurrentFixture ? (
                          <div className="move-reorder-controls">
                            <button
                              type="button"
                              className="move-reorder-button"
                              onClick={() => handleMoveCurrentFixture(-1)}
                              disabled={currentPreviewIndex <= 0}
                              aria-label="Move fixture up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              className="move-reorder-button"
                              onClick={() => handleMoveCurrentFixture(1)}
                              disabled={
                                currentPreviewIndex === -1 ||
                                currentPreviewIndex >=
                                  previewFixtures.length - 1
                              }
                              aria-label="Move fixture down"
                            >
                              ▼
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={`move-swap-action ${
                              isSwapTarget ? "selected" : ""
                            }`}
                            onClick={() => handleSwapWithFixture(pitchFixture.id)}
                          >
                            Swap
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {stepTwoHint && (
            <div className="move-fixture-hint" role="status">
              {stepTwoHint}
            </div>
          )}

          <div className="move-entry-actions">
            <button
              type="button"
              className="btn btn-tertiary"
              onClick={handleStepTwoBack}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isLoading || !canReviewMove}
              onClick={() => setCurrentStep(3)}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {currentStep === 3 && (
        <section className="move-confirm-card">
          <div className="move-step-heading">
            <span className="move-step-index">Confirm</span>
            <h4>Confirm</h4>
          </div>

          <p className="move-confirm-text">{confirmationText}</p>

          {confirmMessage && (
            <div className="move-fixture-hint" role="status">
              {confirmMessage}
            </div>
          )}

          <div className="move-entry-actions">
            <button
              type="button"
              className="btn btn-tertiary"
              onClick={() => setCurrentStep(2)}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canSubmit || isLoading || isSaving}
              onClick={handleSubmit}
            >
              {isSaving ? "Moving…" : "Apply move"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
