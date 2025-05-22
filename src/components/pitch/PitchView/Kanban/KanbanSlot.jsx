import PitchIcon from "../../../../shared/icons/icon-pitch-2.svg?react";
import './KanbanSlot.scss';

// A simple warning triangle SVG component
const WarningIcon = () => (
  <svg viewBox="0 0 100 100" width="36" height="36" className="warning-icon">
    <polygon points="50,10 90,90 10,90" />
  </svg>
);

const KanbanSlot = ({ slotIndex, columnIndex, children, pitchName, showWarningIcon, isMatchInProgress }) => {
  const isOngoingColumn = columnIndex === 1;
  // In Ongoing column, `children` (KanbanCard) implies a match is in progress.
  // `isMatchInProgress` prop makes this explicit.
  const hasActiveMatchInOngoing = isOngoingColumn && isMatchInProgress;

  let effectiveSlotStyle = {};
  let slotClasses = ['kanban-slot'];
  let headerStyle = {};

  if (isOngoingColumn) {
    // Styles for Ongoing column slots
    // Always apply standard green striped background for ongoing slots
    const desaturatedGreen1 = '#A2AD8A'; // Darker desaturated green
    const desaturatedGreen2 = '#B9C2A5'; // Lighter desaturated green
    effectiveSlotStyle.background = `repeating-linear-gradient(45deg, ${desaturatedGreen1}, ${desaturatedGreen1} 10px, ${desaturatedGreen2} 10px, ${desaturatedGreen2} 20px)`;
    
    // Make the header background transparent so the slot's striped background shows through
    headerStyle.backgroundColor = 'transparent';
  } else {
    // Styles for Planned or Finished column slots
    if (!children) { // Empty planned/finished slot
      slotClasses.push((columnIndex + slotIndex) % 2 === 0 ? 'gray1' : 'gray2');
    }
  }

  return (
    <div className={slotClasses.join(' ')} style={effectiveSlotStyle}>
      {pitchName && ( // Header is shown if pitchName is provided (i.e., for Ongoing column slots)
        <div className="slot-pitch-name" style={headerStyle}>
          <div className="pitch-identifier">
            <PitchIcon width={219*0.4} height={159*0.4} />
            <span>{pitchName}</span>
          </div>
          <div className="slot-status-text">
            {isMatchInProgress ? (
              <span className="status-in-progress">MATCH IN PROGRESS</span>
            ) : showWarningIcon ? (
              <>
                <WarningIcon />
                <span className="warn">NO ACTIVE MATCH</span>
              </>
            ) : (
              // For ongoing column, if no match in progress and no warning, it means no more matches for this pitch.
              // For other columns, this state isn't applicable as they don't show this header.
              <span className="no-warn">{isOngoingColumn ? "NO MORE MATCHES" : "NO ACTIVE MATCH"}</span>
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
