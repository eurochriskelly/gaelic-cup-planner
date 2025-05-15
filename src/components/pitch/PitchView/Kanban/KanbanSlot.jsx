import './KanbanSlot.scss';

const KanbanSlot = ({ slotIndex, columnIndex }) => {
  // Determine color based on column and slot index for alternating pattern
  // (0,0) -> gray1, (0,1) -> gray2, (1,0) -> gray2, (1,1) -> gray1
  const colorClass = (columnIndex + slotIndex) % 2 === 0 ? 'gray1' : 'gray2';

  return (
    <div className={`kanban-slot ${colorClass}`}>
      {/* Content for the slot, if any, could go here in the future */}
    </div>
  );
};

export default KanbanSlot;
