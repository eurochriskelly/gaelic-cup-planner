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
  allPlannedFixtures, // New prop: all planned fixtures for warning logic in ongoing column
  // Props for maximization
  columnKey,
  isCurrentlyMaximized,
  onToggleMaximize,
}) => {
  let columnSlots;

  if (columnIndex === 1 && allTournamentPitches && allTournamentPitches.length > 0) { // Middle "Ongoing" column
    // Filter out "All Pitches" before mapping to slots
    let actualPitches = allTournamentPitches.filter(p => p !== 'All Pitches');

    // Sort pitches: empty slots first, then active slots. Maintain alphabetical order within groups.
    actualPitches.sort((pitchA, pitchB) => {
      const isPitchAEmpty = !fixtures.find(f => f.pitch === pitchA);
      const isPitchBEmpty = !fixtures.find(f => f.pitch === pitchB);

      if (isPitchAEmpty && !isPitchBEmpty) {
        return -1; // Pitch A (empty) comes before Pitch B (active)
      }
      if (!isPitchAEmpty && isPitchBEmpty) {
        return 1;  // Pitch B (empty) comes before Pitch A (active)
      }
      // If both are empty or both are active, maintain original relative (alphabetical) order
      return 0; 
    });

    // Iterate over all unique pitches defined for the tournament for this column
    columnSlots = actualPitches.map((pitch, index) => {
      // Find if there's an active fixture (from the `fixtures` prop - which are 'started' fixtures) for this specific pitch
      const fixtureForPitchSlot = fixtures.find(f => f.pitch === pitch);
      const slotBackgroundColor = getPitchColor(pitch); // Use getPitchColor for consistent pitch colors

      let showWarning = false;
      if (!fixtureForPitchSlot && allPlannedFixtures) {
        // If slot is empty, check if there are any planned fixtures for this pitch
        showWarning = allPlannedFixtures.some(pf => pf.pitch === pitch);
      }

      return (
        <KanbanSlot
          key={`pitch-slot-${pitch}`} // Keyed by pitch name for stability
          slotIndex={index} // Relative index within this dynamic column
          columnIndex={columnIndex}
          slotBackgroundColor={slotBackgroundColor}
          pitchName={pitch} // Pass the pitch name to the slot
          showWarningIcon={showWarning} // Pass warning status
          isMatchInProgress={!!fixtureForPitchSlot} // Explicitly pass if match is in progress
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
        <span>{`${title}`}<span className="text-white ml-2">({fixtureCount})</span></span>
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
