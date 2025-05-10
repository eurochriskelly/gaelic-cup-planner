import React from 'react';
import KanbanCard from './KanbanCard';
import './KanbanColumn.scss';

const KanbanColumn = ({
  title,
  fixtures,
  onDrop,
  onDragOver,
  onDragStart,
  handleFixtureClick,
  selectedFixture,
  getPitchColor,
}) => {
  return (
    <div
      className="kanban-column"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <h2 className="column-title">{title.charAt(0).toUpperCase() + title.slice(1)}</h2>
      <div className="column-content">
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
  );
};

export default KanbanColumn;
