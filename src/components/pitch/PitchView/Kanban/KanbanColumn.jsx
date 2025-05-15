import KanbanCard from './KanbanCard';
import KanbanSlot from './KanbanSlot'; // Import the new KanbanSlot component
import './KanbanColumn.scss';

const NUM_SLOTS_PER_COLUMN = 10; // Define how many slots to render per column

const KanbanColumn = ({
  title,
  fixtures,
  onDrop,
  onDragOver,
  onDragStart,
  handleFixtureClick,
  selectedFixture,
  getPitchColor,
  columnIndex, // Add columnIndex prop
}) => {
  return (
    <div
      className="kanban-column"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="column-header">{title}</div>
      <div className="column-content">
        <div className="slots-background">
          {Array.from({ length: NUM_SLOTS_PER_COLUMN }).map((_, slotIndex) => (
            <KanbanSlot
              key={slotIndex}
              slotIndex={slotIndex}
              columnIndex={columnIndex}
            />
          ))}
        </div>
        <div className="cards-foreground">
          {fixtures.map(fixture => (
            <KanbanCard
              key={fixture.id}
              fixture={fixture}
              onDragStart={(e) => onDragStart(e, fixture.id)}
              onClick={() => handleFixtureClick(fixture)}
              isSelected={selectedFixture && selectedFixture.id === fixture.id}
              pitchColor={getPitchColor(fixture.pitch)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
