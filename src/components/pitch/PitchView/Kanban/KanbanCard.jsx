import { useEffect, useRef, useState } from 'react';
import './KanbanCard.scss';
import FixtureBar from './FixtureBar'; // Import FixtureBar
import TimeDisplay from './TimeDisplay'; // Import TimeDisplay component
import PitchIcon from '../../../../shared/icons/icon-pitch-2.svg?react';
import UmpireIcon from '../../../../shared/icons/icon-umpires-circle.svg?react';
import CancelIcon from '../../../../shared/icons/icon-cancel.svg?react';
import API from '../../../../shared/api/endpoints';
import '../../../../components/web/logo-box.js';
import '../../../../components/web/team-name.js';
import '../../../../components/web/gaelic-score.js';

const KanbanCard = ({ fixture, onDragStart, onClick, isSelected, showDetailsPanel, moveBarFixtureId, setMoveBarFixtureId, pendingMove, setPendingMove, recentlyMovedFixtureId, findAdjacentFixture, fetchFixtures }) => {
  const toolboxRef = useRef(null);
  const [showMessage, setShowMessage] = useState(false);

  const displayCategory = fixture.category ? fixture.category.substring(0, 9).toUpperCase() : '';
  const displayStage = fixture.stage ? fixture.stage.toUpperCase().replace('PLT', 'Plate').replace('CUP', 'Cup').replace('SHD', 'Shield').replace('_', '/') : '';
  const displayNumber = fixture?.groupNumber || '0';
  const teamStyle = { fontSize: '1.6em', fontWeight: 'bold', marginLeft: '-0.3rem' }
   const hasScore = typeof fixture.goals1 === 'number' &&
     typeof fixture.goals2 === 'number' &&
     typeof fixture.points1 === 'number' &&
     typeof fixture.points2 === 'number' &&
     !isNaN(fixture.goals1) &&
     !isNaN(fixture.goals2) &&
     !isNaN(fixture.points1) &&
     !isNaN(fixture.points2);
   const vspace = hasScore ? '2.1rem' : 0;

    // Calculate totals for determining winner
    const total1 = hasScore ? (fixture.goals1 * 3 + fixture.points1) : 0;
    const total2 = hasScore ? (fixture.goals2 * 3 + fixture.points2) : 0;
    const isFinished = fixture.outcome === 'played';
    const isOngoingWithScore = !isFinished && hasScore;
    const team1Won = isFinished && total1 > total2;
    const team2Won = isFinished && total2 > total1;
    const isDraw = isFinished && total1 === total2;

  useEffect(() => {
    const positionToolbox = () => {
      try {
        const tb = toolboxRef.current;
        if (!tb) return;
        tb.classList.remove('align-left');
        const rect = tb.getBoundingClientRect();
        const needsLeft = rect.right > window.innerWidth - 8;
        tb.classList.toggle('align-left', needsLeft);
      } catch (error) {
        console.error('Error positioning toolbox:', error);
      }
    };

    if (fixture.id === moveBarFixtureId) {
      positionToolbox();
    }
  }, [fixture.id, moveBarFixtureId]);

  const handleClick = () => {
    setMoveBarFixtureId(null);
    onClick();
  };

  const isPendingMove = pendingMove && (fixture.id === moveBarFixtureId || fixture.id === pendingMove.targetFixtureId);
  const isRecentlyMoved = fixture.id === recentlyMovedFixtureId;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={handleClick}
      className={`kanban-card ${isSelected ? 'selected' : ''} ${isPendingMove ? 'pending-move' : ''} ${isRecentlyMoved ? 'recently-moved' : ''}`}
    >
      <FixtureBar
        fixtureId={fixture.id}
        category={displayCategory}
        stage={displayStage}
        number={displayNumber}
        competitionPrefix={fixture?.competition?.initials}
        competitionOffset={fixture?.competition?.offset}
      />
      {fixture.endedWithoutScore && (
        <div className="warning-icon" style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'orange', fontSize: '2rem' }}>
          <CancelIcon width="24" height="24" />
        </div>
      )}
      {(fixture.scheduledTime && fixture?.lane?.current !== 'finished')? (
        <TimeDisplay
          scheduledTime={fixture.scheduledTime}
          startedTime={fixture.startedTime}
        />
      ) : (
        <div style={{height:'2.4rem'}}>&nbsp;</div>
      )}
      <div className="kanban-card-content-wrapper">
        <div className="teams-container">
          <div className="team-row pb-1">
            <team-name
              style={teamStyle}
              name={fixture.team1 || 'TBD'}
              showLogo="true"
              height="50px" // Increased from 22px to 26px (20% larger)
              maxchars="28"
              title-margin-below={vspace}
              logo-margin-right="0.5rem"
            ></team-name>
             {/* Team 1 score under name, right-aligned */}
              {hasScore && (
                <div className={`score-row ${isOngoingWithScore ? '' : team1Won ? 'winner' : team2Won ? 'loser' : isDraw ? 'draw' : ''}`}>
                  <gaelic-score
                    goals={fixture.goals1 ?? 0}
                    points={fixture.points1 ?? 0}
                    goalsagainst={fixture.goals2 ?? 0}
                    pointsagainst={fixture.points2 ?? 0}
                    played={fixture.outcome === 'played'}
                  ></gaelic-score>
                </div>
              )}
          </div>

          <div className="vs-row">vs</div>

          <div className="team-row">
            {/* Team 2 score above name, right-aligned */}
            <team-name
              style={teamStyle}
              name={fixture.team2 || 'TBD'}
              showLogo="true"
              height="50px" // Increased from 22px to 26px (20% larger)
              maxchars="28"
              title-margin-below={vspace}
              logo-margin-right="0.5rem"
            ></team-name>
              {hasScore && (
                <div className={`score-row ${isOngoingWithScore ? '' : team2Won ? 'winner' : team1Won ? 'loser' : isDraw ? 'draw' : ''}`}>
                  <gaelic-score
                    goals={fixture.goals2 ?? 0}
                    points={fixture.points2 ?? 0}
                    goalsagainst={fixture.goals1 ?? 0}
                    pointsagainst={fixture.points1 ?? 0}
                    played={fixture.outcome === 'played'}
                  ></gaelic-score>
                </div>
              )}
          </div>
        </div>
        {(fixture?.lane?.current === 'planned') &&
            <div className="card-detail pitch-info">
              <PitchIcon width={48} height={48} />
              <b>{fixture.pitch}</b>
            </div>
        }
        {(fixture?.lane?.current === 'queued' || fixture?.lane?.current === 'started') &&
          <>
            <div className="card-detail umpire-info">
              <div>
                <team-name
                  style={teamStyle}
                  name={fixture.umpireTeam|| 'TBD'}
                  direction="r2l"
                  showLogo="true"
                  height="35px" // Increased from 22px to 26px (20% larger)
                  maxchars="28"
                  title-margin-below={vspace}
                  logo-margin-right="0.5rem"
                ></team-name>
                <UmpireIcon width={42} height={42} />
              </div>
            </div>
         </>
         }
       </div>
       <div className={`fixture-toolbox ${fixture.id === moveBarFixtureId ? 'visible' : ''}`} ref={toolboxRef} role="toolbar" aria-label="Fixture tools">
         {isPendingMove ? (
           <>
              <button className="tool-btn" aria-label="Confirm move" onClick={async (e) => {
                e.stopPropagation();
                try {
                  await API.rescheduleMatch(fixture.tournamentId, fixture.pitch, fixture.id, pendingMove.targetFixtureId, 'swapTime');
                  await fetchFixtures(true);
                  setRecentlyMovedFixtureId(fixture.id);
                  setTimeout(() => setRecentlyMovedFixtureId(null), 2000);
                } catch (error) {
                  console.error('Error moving fixture:', error);
                }
                setPendingMove(null);
                setMoveBarFixtureId(null);
              }}>✓</button>
              <button className="tool-btn" aria-label="Cancel move" onClick={(e) => {
                e.stopPropagation();
                setPendingMove(null);
              }}>✗</button>
           </>
         ) : (
           <>
               <button className="tool-btn" aria-label="Move up" onClick={(e) => {
                 e.stopPropagation();
                 setShowMessage(true);
                 setMoveBarFixtureId(null);
               }}>▲</button>
              <button className="tool-btn" aria-label="More" onClick={(e) => {
                e.stopPropagation();
                showDetailsPanel('move');
              }}>⋯</button>
               <button className="tool-btn" aria-label="Move down" onClick={(e) => {
                 e.stopPropagation();
                 setShowMessage(true);
                 setMoveBarFixtureId(null);
               }}>▼</button>
           </>
         )}
        </div>
        {showMessage && (
          <div className="reschedule-message-overlay">
            <div className="reschedule-message">
              <div className="warning-icon">⚠️</div>
              <div className="warning-message">In this tournament, rescheduling requires CCO approval</div>
              <button onClick={() => setShowMessage(false)}>OK</button>
            </div>
          </div>
        )}
      </div>
    );
  };



 export default KanbanCard;
