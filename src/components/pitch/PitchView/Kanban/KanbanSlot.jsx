import './KanbanSlot.scss';

const KanbanSlot = ({ slotIndex, columnIndex, children, slotBackgroundColor, pitchName }) => {
  // Determine color class for default gray slots
  // This is only applied if slotBackgroundColor is not provided.
  const colorClass = !slotBackgroundColor && (columnIndex + slotIndex) % 2 === 0 ? 'gray1' : 'gray2';

  return (
    <div
      className={`kanban-slot ${slotBackgroundColor ? '' : colorClass}`}
      style={slotBackgroundColor ? { backgroundColor: slotBackgroundColor } : {}}
    >
      {children ? (
        children // Render the KanbanCard if it exists
      ) : pitchName ? ( // Otherwise, if pitchName is provided, display it
        <div className="slot-pitch-name">
          <div>PITCH</div>
          <div>{pitchName}</div>
        </div>
      ) : null}
    </div>
  );
};

export default KanbanSlot;
