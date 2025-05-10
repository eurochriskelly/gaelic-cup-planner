import './KanbanCard.scss';
import chroma from 'chroma-js'; // Import chroma-js
import '../../../../components/web/logo-box.js';
import '../../../../components/web/team-name.js';

const KanbanCard = ({ fixture, onDragStart, onClick, isSelected, pitchColor }) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={`kanban-card ${isSelected ? 'selected' : ''}`}
      style={{ backgroundColor: pitchColor, borderLeft: `5px solid ${pitchColor ? chroma(pitchColor).darken().hex() : '#ccc'}` }}
    >
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
      {fixture.category && <p className="card-detail">Category: {fixture.category}</p>}
      {fixture.stage && <p className="card-detail">Stage: {fixture.stage}{fixture.groupNumber ? ` (Group ${fixture.groupNumber})` : ''}</p>}
      {(fixture.score1 || fixture.score2) && (
        <p className="card-detail">Score: {fixture.score1 || '0-00'} - {fixture.score2 || '0-00'}</p>
      )}
    </div>
  );
};

export default KanbanCard;
