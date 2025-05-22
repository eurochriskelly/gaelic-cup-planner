import './KanbanCard.scss';
import FixtureBar from '../Fixture/FixtureBar'; // Import FixtureBar
import TimeDisplay from './TimeDisplay'; // Import TimeDisplay component
import PitchIcon from '../../../../shared/icons/icon-pitch-2.svg?react';
import UmpireIcon from '../../../../shared/icons/icon-umpires-circle.svg?react';
import '../../../../components/web/logo-box.js';
import '../../../../components/web/team-name.js';
import '../../../../components/web/gaelic-score.js';

const KanbanCard = ({ fixture, onDragStart, onClick, isSelected }) => {
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
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={`kanban-card ${isSelected ? 'selected' : ''}`}
    >
      <FixtureBar
        fixtureId={fixture.id}
        category={displayCategory}
        stage={displayStage}
        number={displayNumber}
      />
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
              <div className="score-row">
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
              <div className="score-row">
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
        {(fixture?.lane?.current === 'planned' || fixture?.lane?.current === 'started') &&
          <>
            <div className="card-detail umpire-info">
              <div>
                <UmpireIcon width={42} height={42} />
                <logo-box
                  title={fixture.umpireTeam || 'TBD'}
                  size="45px"
                ></logo-box>
              </div>
            </div>
        </>
        }
      </div>
    </div>
  );
};

export default KanbanCard;
