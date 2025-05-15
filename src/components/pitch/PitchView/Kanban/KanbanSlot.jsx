import './KanbanSlot.scss';

const KanbanSlot = ({ slotIndex, columnIndex, children }) => { // Added children prop
  // Determine color based on column and slot index for alternating pattern
  // (0,0) -> gray1, (0,1) -> gray2, (1,0) -> gray2, (1,1) -> gray1
  const colorClass = (columnIndex + slotIndex) % 2 === 0 ? 'gray1' : 'gray2';

  return (
    <div className={`kanban-slot ${colorClass}`}>
      {children} {/* Render children (the KanbanCard) here */}
    </div>
  );
};

export default KanbanSlot;
