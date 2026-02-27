import './KanbanSlot.scss';

const KanbanSlot = ({ slotIndex, columnIndex, columnKey, children, pitchName }) => {
  const isDynamicSlotColumn = columnKey === 'started' || columnKey === 'queued';

  let effectiveSlotStyle = {};
  let slotClasses = ['kanban-slot'];

  if (isDynamicSlotColumn) {
    // Styles for "Next" (queued) or "Ongoing" (started) column slots
  } else {
    // Styles for "Planned" or "Finished" column slots (static slots)
    if (!children) { // Empty planned/finished slot
      // columnIndex is the logical index: Queued (0), Planned (1), Started (2), Finished (3)
      // This styling is for Planned (1) and Finished (3)
      slotClasses.push((columnIndex + slotIndex) % 2 === 0 ? 'gray1' : 'gray2');
    }
  }

  return (
    <div className={slotClasses.join(' ')} style={effectiveSlotStyle}>
      {children && ( // Render KanbanCard if it exists (for any column type)
        <div className="slot-card-container">
          {children}
        </div>
      )}

      {!pitchName && !children && ( // Placeholder for empty slots in Planned/Finished columns
        <div className="empty-planned-finished-slot-placeholder">&nbsp;</div>
      )}
    </div>
  );
};

export default KanbanSlot;
