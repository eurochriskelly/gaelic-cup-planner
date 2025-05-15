import KanbanCard from './KanbanCard';
import KanbanSlot from './KanbanSlot';
import './KanbanColumn.scss';

const NUM_SLOTS_PER_COLUMN = 10; // Define how many slots to render per column for non-dynamic columns

// Define 20 pastel colors
const PASTEL_COLORS = [
  '#FFDFD3', '#D3FFD3', '#D3D3FF', '#FFFFD3', '#FFD3FF',
  '#D3FFFF', '#E8D3FF', '#FFEBD3', '#D3FFE8', '#FFD3E8',
  '#FADADD', '#FDFD96', '#CDFADF', '#BDECB6', '#C9EBFD',
  '#D7C9FD', '#FDC9D7', '#FDEAC9', '#C9FDEE', '#E6E6FA'
];

const KanbanColumn = ({
  title,
  fixtures, // This is the array of fixtures for this specific column
  onDrop,
  onDragOver,
  onDragStart,
  handleFixtureClick,
  selectedFixture,
  getPitchColor,
  columnIndex,
  allTournamentPitches, // New prop for all pitches in the tournament
}) => {
  let columnSlots;

  if (columnIndex === 1 && allTournamentPitches && allTournamentPitches.length > 0) { // Middle "Ongoing" column, now uses allTournamentPitches
    // Iterate over all unique pitches defined for the tournament for this column
    columnSlots = allTournamentPitches.map((pitch, index) => {
      // Find if there's an active fixture (from the `fixtures` prop) for this specific pitch
      const fixtureForPitchSlot = fixtures.find(f => f.pitch === pitch);
      const slotBackgroundColor = PASTEL_COLORS[index % PASTEL_COLORS.length];
      return (
        <KanbanSlot
          key={`pitch-slot-${pitch}`} // Keyed by pitch name for stability
          slotIndex={index} // Relative index within this dynamic column
          columnIndex={columnIndex}
          slotBackgroundColor={slotBackgroundColor}
          pitchName={pitch} // Pass the pitch name to the slot
        >
          {fixtureForPitchSlot && (
            <KanbanCard
              key={fixtureForPitchSlot.id}
              fixture={fixtureForPitchSlot}
              onDragStart={(e) => onDragStart(e, fixtureForPitchSlot.id)}
              onClick={() => handleFixtureClick(fixtureForPitchSlot)}
              isSelected={selectedFixture && selectedFixture.id === fixtureForPitchSlot.id}
              pitchColor={getPitchColor(fixtureForPitchSlot.pitch)} // This might be redundant if slot color indicates pitch
            />
          )}
        </KanbanSlot>
      );
    });
  } else { // "Planned" or "Finished" columns
    columnSlots = Array.from({ length: NUM_SLOTS_PER_COLUMN }).map((_, slotIndex) => {
      const fixtureForSlot = fixtures[slotIndex];
      return (
        <KanbanSlot
          key={`slot-${columnIndex}-${slotIndex}`}
          slotIndex={slotIndex}
          columnIndex={columnIndex}
        >
          {fixtureForSlot && (
            <KanbanCard
              key={fixtureForSlot.id}
              fixture={fixtureForSlot}
              onDragStart={(e) => onDragStart(e, fixtureForSlot.id)}
              onClick={() => handleFixtureClick(fixtureForSlot)}
              isSelected={selectedFixture && selectedFixture.id === fixtureForSlot.id}
              pitchColor={getPitchColor(fixtureForSlot.pitch)}
            />
          )}
        </KanbanSlot>
      );
    });
  }

  return (
    <div
      className="kanban-column"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="column-header">{title}</div>
      <div className="column-content">
        {columnSlots}
      </div>
    </div>
  );
};

export default KanbanColumn;
