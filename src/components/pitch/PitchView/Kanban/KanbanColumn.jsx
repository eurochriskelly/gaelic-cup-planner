import KanbanCard from './KanbanCard';
import KanbanSlot from './KanbanSlot';
import './KanbanColumn.scss';

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
  // Props for maximization
  columnKey, 
  isCurrentlyMaximized,
  onToggleMaximize,
}) => {
  let columnSlots;

  if (columnIndex === 1 && allTournamentPitches && allTournamentPitches.length > 0) { // Middle "Ongoing" column, now uses allTournamentPitches
    // Filter out "All Pitches" before mapping to slots
    const actualPitches = allTournamentPitches.filter(p => p !== 'All Pitches');
    // Iterate over all unique pitches defined for the tournament for this column
    columnSlots = actualPitches.map((pitch, index) => {
      // Find if there's an active fixture (from the `fixtures` prop) for this specific pitch
      const fixtureForPitchSlot = fixtures.find(f => f.pitch === pitch);
      const slotBackgroundColor = getPitchColor(pitch); // Use getPitchColor for consistent pitch colors
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
    const numFixturesInColumn = fixtures.length;
    const numSlots = Math.max(6, numFixturesInColumn); // Use at least 6 slots, or more if there are more fixtures

    columnSlots = Array.from({ length: numSlots }).map((_, slotIndex) => {
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

  const fixtureCount = fixtures.length;

  return (
    <div
      className="kanban-column"
      data-column-key={columnKey} // For CSS targeting
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="column-header">
        <span>{`${title}`}<span className="text-gray-900 ml-2">({fixtureCount})</span></span>
        {onToggleMaximize && (
          <button
            type="button"
            className="column-maximize-button"
            onClick={() => onToggleMaximize(columnKey)}
            aria-label={isCurrentlyMaximized ? `Restore ${title} column` : `Focus ${title} column`}
          >
            {isCurrentlyMaximized ? 'Restore' : 'Focus'}
          </button>
        )}
      </div>
      <div className="column-content">
        {columnSlots}
      </div>
    </div>
  );
};

export default KanbanColumn;
