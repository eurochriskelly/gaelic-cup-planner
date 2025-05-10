import './KanbanCard.scss';
import chroma from 'chroma-js'; // Import chroma-js

const KanbanCard = ({ fixture, onDragStart, onClick, isSelected, pitchColor }) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={`kanban-card ${isSelected ? 'selected' : ''}`}
      style={{ backgroundColor: pitchColor, borderLeft: `5px solid ${pitchColor ? chroma(pitchColor).darken().hex() : '#ccc'}` }}
    >
      <h3 className="card-title">{fixture.team1 || 'TBD'} vs {fixture.team2 || 'TBD'}</h3>
      <p className="card-detail">Time: {fixture.plannedStart || fixture.startTime}</p>
      <p className="card-detail">Pitch: {fixture.pitch}</p>
      {fixture.category && <p className="card-detail">Category: {fixture.category}</p>}
      {fixture.stage && <p className="card-detail">Stage: {fixture.stage}{fixture.groupNumber ? ` (Group ${fixture.groupNumber})` : ''}</p>}
      {(fixture.score1 || fixture.score2) && ( // Assuming score format might vary
        <p className="card-detail">Score: {fixture.score1 || '0-00'} - {fixture.score2 || '0-00'}</p>
      )}
    </div>
  );
};

// Helper for chroma, or use a library if available
// Basic polyfill if chroma.js is not globally available or imported
// Remove this entire block:
// if (typeof chroma === 'undefined') {
//   // This is a very simplistic placeholder. For real color manipulation, use a library.
//   global.chroma = (color) => ({
//     darken: () => {
//       // Basic darken for demo, not perceptually accurate
//       if (color.startsWith('#') && color.length === 7) {
//         let r = parseInt(color.slice(1, 3), 16);
//         let g = parseInt(color.slice(3, 5), 16);
//         let b = parseInt(color.slice(5, 7), 16);
//         r = Math.max(0, r - 30);
//         g = Math.max(0, g - 30);
//         b = Math.max(0, b - 30);
//         return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
//       }
//       return '#555555'; // fallback
//     },
//     hex: () => color, // assuming input is hex or this method is called on a chroma object
//   });
// }


export default KanbanCard;
