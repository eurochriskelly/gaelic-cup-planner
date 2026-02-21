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

    const getNumber = (val) => {
        if (val === null || val === undefined || val === '') return 0;
        const num = Number(val);
        return isNaN(num) ? 0 : num;
    };


    const hasScore = (fixture.goals1 !== null && fixture.goals1 !== undefined) &&
                     (fixture.goals2 !== null && fixture.goals2 !== undefined) &&
                     (fixture.points1 !== null && fixture.points1 !== undefined) &&
                     (fixture.points2 !== null && fixture.points2 !== undefined);

   // Check if extra time exists (values are defined, even if 0)
   const hasExtraTime = hasScore && (
       (fixture.goals1Extra !== null && fixture.goals1Extra !== undefined) ||
       (fixture.points1Extra !== null && fixture.points1Extra !== undefined) ||
       (fixture.goals2Extra !== null && fixture.goals2Extra !== undefined) ||
       (fixture.points2Extra !== null && fixture.points2Extra !== undefined)
   );

   const vspace = hasScore ? '2.1rem' : 0;

    // Calculate totals for determining winner (including extra time if present)
    // We strictly convert to Number to avoid string concatenation bugs
    const goals1Total = hasScore ? getNumber(fixture.goals1) + getNumber(fixture.goals1Extra) : 0;
    const points1Total = hasScore ? getNumber(fixture.points1) + getNumber(fixture.points1Extra) : 0;
    const goals2Total = hasScore ? getNumber(fixture.goals2) + getNumber(fixture.goals2Extra) : 0;
    const points2Total = hasScore ? getNumber(fixture.points2) + getNumber(fixture.points2Extra) : 0;



    const total1 = goals1Total * 3 + points1Total;
    const total2 = goals2Total * 3 + points2Total;
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
                 <div className="score-container">
                   <div className={`score-badge ${isOngoingWithScore ? '' : team1Won ? 'winner' : team2Won ? 'loser' : isDraw ? 'draw' : ''}`}>
                     <gaelic-score
                       style={{ width: 'auto' }}
                       goals={goals1Total}
                       points={points1Total}
                       goalsagainst={goals2Total}
                       pointsagainst={points2Total}
                       played={fixture.outcome === 'played'}
                     ></gaelic-score>
                   </div>
                   {hasExtraTime && <span className="aet-label">AET</span>}
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
                <div className="score-container">
                  <div className={`score-badge ${isOngoingWithScore ? '' : team2Won ? 'winner' : team1Won ? 'loser' : isDraw ? 'draw' : ''}`}>
                    <gaelic-score
                      style={{ width: 'auto' }}
                      goals={goals2Total}
                      points={points2Total}
                      goalsagainst={goals1Total}
                      pointsagainst={points1Total}
                      played={fixture.outcome === 'played'}
                    ></gaelic-score>
                  </div>
                  {hasExtraTime && <span className="aet-label">AET</span>}
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
