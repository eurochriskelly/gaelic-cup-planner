import './KanbanSlot.scss';

const KanbanSlot = ({ slotIndex, columnIndex, children, slotBackgroundColor }) => {
  // Determine color class for default gray slots
  // This is only applied if slotBackgroundColor is not provided.
  const colorClass = !slotBackgroundColor && (columnIndex + slotIndex) % 2 === 0 ? 'gray1' : 'gray2';

  return (
    <div
      className={`kanban-slot ${slotBackgroundColor ? '' : colorClass}`}
      style={slotBackgroundColor ? { backgroundColor: slotBackgroundColor } : {}}
    >
      {children} {/* Render children (the KanbanCard) here */}
    </div>
  );
};

export default KanbanSlot;
