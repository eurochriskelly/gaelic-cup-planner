import PitchIcon from "../../../../shared/icons/icon-pitch-2.svg?react";
import './KanbanSlot.scss';

// A simple warning triangle SVG component
const WarningIcon = () => (
  <svg viewBox="0 0 100 100" width="36" height="36" className="warning-icon">
    <polygon points="50,10 90,90 10,90" />
  </svg>
);

const KanbanSlot = ({ slotIndex, columnIndex, columnKey, children, pitchName, showWarningIcon, isMatchInProgress }) => {
  const isDynamicSlotColumn = columnKey === 'started' || columnKey === 'queued';

  let effectiveSlotStyle = {};
  let slotClasses = ['kanban-slot'];
  let headerStyle = {};

  if (isDynamicSlotColumn) {
    // Styles for "Next" (queued) or "Ongoing" (started) column slots
    const desaturatedGreen1 = '#A2AD8A'; // Darker desaturated green
    const desaturatedGreen2 = '#B9C2A5'; // Lighter desaturated green
    effectiveSlotStyle.background = `repeating-linear-gradient(45deg, ${desaturatedGreen1}, ${desaturatedGreen1} 10px, ${desaturatedGreen2} 10px, ${desaturatedGreen2} 20px)`;
    
    headerStyle.backgroundColor = 'transparent'; // Header background for dynamic slots
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
      {pitchName && isDynamicSlotColumn && ( // Header is shown if pitchName is provided AND it's a dynamic slot column
        <div className="slot-pitch-name" style={headerStyle}>
          <div className="pitch-identifier">
            <PitchIcon width={219*0.4} height={159*0.4} />
            <span>{pitchName}</span>
          </div>
          <div className="slot-status-text">
            {isMatchInProgress ? (
              <span className="status-in-progress">
                {columnKey === 'queued' ? "READY" : "MATCH IN PROGRESS"}
              </span>
            ) : showWarningIcon ? ( // showWarningIcon is true for empty 'started' slots with other planned matches
              <>
                <WarningIcon />
                <span className="warn">NO ACTIVE MATCH</span> 
              </>
            ) : (
              // For 'queued' or 'started' slots without a match and no warning:
              // If 'started' (Ongoing): "NO MORE MATCHES" (as no warning means no other planned)
              // If 'queued' (Next): "AVAILABLE" or "READY FOR MATCH" (or simply "NO ACTIVE MATCH" if preferred)
              <span className="no-warn">
                {columnKey === 'started' ? "NO MORE MATCHES" : 
                 columnKey === 'queued' ? "NO MATCH READY" : 
                 "NO ACTIVE MATCH" /* Fallback, though should be covered by dynamicSlotColumn */}
              </span>
            )}
          </div>
        </div>
      )}

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
