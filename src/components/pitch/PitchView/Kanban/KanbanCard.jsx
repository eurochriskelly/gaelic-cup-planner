import './KanbanCard.scss';
import chroma from 'chroma-js'; // Import chroma-js
import FixtureBar from '../Fixture/FixtureBar'; // Import FixtureBar
import '../../../../components/web/logo-box.js';
import '../../../../components/web/team-name.js';

const KanbanCard = ({ fixture, onDragStart, onClick, isSelected, pitchColor }) => {
  const cardStyle = {
    borderLeft: `5px solid ${pitchColor ? chroma(pitchColor).darken().hex() : '#ccc'}`,
  };

  const contentWrapperStyle = {
    backgroundColor: pitchColor,
  };

  const displayCategory = fixture.category ? fixture.category.substring(0, 9).toUpperCase() : '';
  const displayStage = fixture.stage ? fixture.stage.toUpperCase().replace('PLT', 'Plate').replace('CUP', 'Cup').replace('SHD', 'Shield').replace('_', '/') : '';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={`kanban-card ${isSelected ? 'selected' : ''}`}
      style={cardStyle}
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
          ></team-name>
        </div>
        <div className="vs-row">vs</div>
        <div className="team-row">
          <team-name
            style={{ fontSize: '1.4em', fontWeight: 'bold' }}
            name={fixture.team2 || 'TBD'}
            showLogo="true"
            height="40px" // Increased from 22px to 26px (20% larger)
            maxchars="28"
          ></team-name>
        </div>
        </div>

        <p className="card-detail">Time: {fixture.plannedStart || fixture.startTime}</p>
        <p className="card-detail">Pitch: {fixture.pitch}</p>
        {/* Category and Stage are now in FixtureBar */}
        {(fixture.score1 || fixture.score2) && (
          <p className="card-detail">Score: {fixture.score1 || '0-00'} - {fixture.score2 || '0-00'}</p>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;
