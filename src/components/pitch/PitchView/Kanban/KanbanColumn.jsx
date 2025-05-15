import KanbanCard from './KanbanCard';
import KanbanSlot from './KanbanSlot';
import './KanbanColumn.scss';

const NUM_SLOTS_PER_COLUMN = 10; // Define how many slots to render per column

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
}) => {
  return (
    <div
      className="kanban-column"
      onDrop={onDrop} // Keep onDrop on the column itself for dropping cards into the column
      onDragOver={onDragOver} // Keep onDragOver on the column itself
    >
      <div className="column-header">{title}</div>
      <div className="column-content">
        {Array.from({ length: NUM_SLOTS_PER_COLUMN }).map((_, slotIndex) => {
          const fixtureForSlot = fixtures[slotIndex]; // Get the fixture for this slot index

          return (
            <KanbanSlot
              key={slotIndex} // Slot key is its index
              slotIndex={slotIndex}
              columnIndex={columnIndex}
            >
              {fixtureForSlot && ( // If a fixture exists for this slot, render a KanbanCard
                <KanbanCard
                  key={fixtureForSlot.id} // Card key is fixture ID
                  fixture={fixtureForSlot}
                  onDragStart={(e) => onDragStart(e, fixtureForSlot.id)}
                  onClick={() => handleFixtureClick(fixtureForSlot)}
                  isSelected={selectedFixture && selectedFixture.id === fixtureForSlot.id}
                  pitchColor={getPitchColor(fixtureForSlot.pitch)}
                />
              )}
            </KanbanSlot>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanColumn;
