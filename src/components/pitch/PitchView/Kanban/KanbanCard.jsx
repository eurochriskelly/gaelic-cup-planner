import './KanbanCard.scss';
import chroma from 'chroma-js'; // Import chroma-js
import FixtureBar from '../Fixture/FixtureBar'; // Import FixtureBar
import '../../../../components/web/logo-box.js';
import '../../../../components/web/team-name.js';
import '../../../../components/web/gaelic-score.js';

const KanbanCard = ({ fixture, onDragStart, onClick, isSelected, pitchColor }) => {

  const contentWrapperStyle = {
    backgroundColor: pitchColor,
  };

  const displayCategory = fixture.category ? fixture.category.substring(0, 9).toUpperCase() : '';
  const displayStage = fixture.stage ? fixture.stage.toUpperCase().replace('PLT', 'Plate').replace('CUP', 'Cup').replace('SHD', 'Shield').replace('_', '/') : '';
  const hasScore = fixture.goals1 != null || fixture.points1 != null || fixture.goals2 != null || fixture.points2 != null;
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
      />
      <div className="kanban-card-content-wrapper" style={contentWrapperStyle}>
        <div className="teams-container">
          <div className="team-row">
            <team-name
              style={{ fontSize: '1.4em', fontWeight: 'bold' }}
              name={fixture.team1 || 'TBD'}
              showLogo="true"
              height="40px" // Increased from 22px to 26px (20% larger)
              maxchars="28"
              title-margin-below={hasScore ? '1.4rem': 0}
            ></team-name>
            {/* Team 1 score under name, right-aligned */}
            {hasScore && (
              <div className="score-row">
                <gaelic-score
                  goals={fixture.goals1 ?? 0}
                  points={fixture.points1 ?? 0}
                ></gaelic-score>
              </div>
            )}
          </div>

          <div className="vs-row">vs</div>

          <div className="team-row">
            {/* Team 2 score above name, right-aligned */}
            {hasScore && (
              <div className="score-row">
                <gaelic-score
                  goals={fixture.goals2 ?? 0}
                  points={fixture.points2 ?? 0}
                ></gaelic-score>
              </div>
            )}
            <team-name
              style={{ fontSize: '1.4em', fontWeight: 'bold' }}
              name={fixture.team2 || 'TBD'}
              showLogo="true"
              height="40px" // Increased from 22px to 26px (20% larger)
              maxchars="28"
              title-margin-above={hasScore ? '1.4rem' : 0}
            ></team-name>
          </div>
        </div>

        <p className="card-detail">Time: {fixture.plannedStart || fixture.startTime}</p>
        <p className="card-detail">Pitch: {fixture.pitch}</p>
      </div>
    </div>
  );
};

export default KanbanCard;
