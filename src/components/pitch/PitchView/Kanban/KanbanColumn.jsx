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
   // getPitchColor, // Removed
   columnIndex,
   allTournamentPitches, // New prop for all pitches in the tournament
   allPlannedFixtures, // New prop: all planned fixtures for warning logic in ongoing column
   // Props for maximization
   columnKey,
   isCurrentlyMaximized,
   onToggleMaximize,
   showDetailsPanel,
   moveBarFixtureId,
   setMoveBarFixtureId,
   pendingMove,
   setPendingMove,
   recentlyMovedFixtureId,
   findAdjacentFixture,
   fetchFixtures,
 }) => {
  let columnSlots;
  const isDynamicColumn = columnKey === 'started' || columnKey === 'queued';

  if (isDynamicColumn && allTournamentPitches) { // "Next" (queued) or "Ongoing" (started) column
    // Filter out "All Pitches" before mapping to slots, ensure allTournamentPitches is an array
    let actualPitches = Array.isArray(allTournamentPitches) ? allTournamentPitches.filter(p => p !== 'All Pitches') : [];

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
      return pitchA.localeCompare(pitchB); // Added explicit sort for stability
    });

    // Iterate over all unique pitches defined for the tournament for this column
    columnSlots = actualPitches.map((pitch, index) => {
      const fixtureForPitchSlot = fixtures.find(f => f.pitch === pitch);
      let showWarning = false;
      // Warning logic primarily for 'started' (Ongoing) column if slot is empty but matches are planned for that pitch.
      // For 'queued' (Next) column, an empty slot means nothing is queued for that pitch.
      if (columnKey === 'started' && !fixtureForPitchSlot && allPlannedFixtures) {
        showWarning = allPlannedFixtures.some(pf => pf.pitch === pitch);
      }

      return (
        <KanbanSlot
          key={`pitch-slot-${columnKey}-${pitch}`} // Keyed by columnKey and pitch name
          slotIndex={index}
          columnIndex={columnIndex} // Pass logical index for striping in non-dynamic slots
          columnKey={columnKey} // Pass columnKey for dynamic slot styling/logic
          pitchName={pitch}
          showWarningIcon={showWarning}
          isMatchInProgress={!!fixtureForPitchSlot}
        >
           {fixtureForPitchSlot && (
             <KanbanCard
               key={fixtureForPitchSlot.id}
               fixture={fixtureForPitchSlot}
               onDragStart={(e) => onDragStart(e, fixtureForPitchSlot.id)}
               onClick={() => handleFixtureClick(fixtureForPitchSlot)}
               isSelected={selectedFixture && selectedFixture.id === fixtureForPitchSlot.id}
               showDetailsPanel={showDetailsPanel}
               moveBarFixtureId={moveBarFixtureId}
               setMoveBarFixtureId={setMoveBarFixtureId}
               pendingMove={pendingMove}
               setPendingMove={setPendingMove}
               recentlyMovedFixtureId={recentlyMovedFixtureId}
               findAdjacentFixture={findAdjacentFixture}
               fetchFixtures={fetchFixtures}
             />
           )}
        </KanbanSlot>
      );
    });
     // If actualPitches is empty, columnSlots will be empty. This is intended.
     // For "Next" to have a minimum of 4 slots even if empty, further logic would be needed here
     // or `allTournamentPitches` for "Next" would need to guarantee 4 pitch names.
     // Current implementation matches "Ongoing" behavior.
  } else { // "Planned" or "Finished" columns (static slot generation)
    const numFixturesInColumn = fixtures.length;
    // Ensure at least 6 slots for "Planned", and for "Finished" to give it some body
    const minSlots = (columnKey === 'planned' || columnKey === 'finished') ? Math.max(6, numFixturesInColumn) : numFixturesInColumn;
    const numSlots = Math.max(minSlots, numFixturesInColumn);


    columnSlots = Array.from({ length: numSlots }).map((_, slotIndex) => {
      const fixtureForSlot = fixtures[slotIndex];
      return (
        <KanbanSlot
          key={`slot-${columnKey}-${slotIndex}`} // Keyed by columnKey and slotIndex
          slotIndex={slotIndex}
          columnIndex={columnIndex} // Pass logical index for striping
          columnKey={columnKey} // Pass columnKey
        >
           {fixtureForSlot && (
             <KanbanCard
               key={fixtureForSlot.id}
               fixture={fixtureForSlot}
               onDragStart={(e) => onDragStart(e, fixtureForSlot.id)}
               onClick={() => handleFixtureClick(fixtureForSlot)}
               isSelected={selectedFixture && selectedFixture.id === fixtureForSlot.id}
               showDetailsPanel={showDetailsPanel}
               moveBarFixtureId={moveBarFixtureId}
               setMoveBarFixtureId={setMoveBarFixtureId}
               pendingMove={pendingMove}
               setPendingMove={setPendingMove}
               recentlyMovedFixtureId={recentlyMovedFixtureId}
               findAdjacentFixture={findAdjacentFixture}
               fetchFixtures={fetchFixtures}
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
