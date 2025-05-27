import PitchIcon from "../../../../shared/icons/icon-pitch-2.svg?react";
import OnAirLight from './OnAirLight';
import MinuteClock from './MinuteClock'; // Import the new MinuteClock component
import './KanbanSlot.scss';

const KanbanSlot = ({ slotIndex, columnIndex, columnKey, children, pitchName, showWarningIcon, isMatchInProgress }) => {
  const isDynamicSlotColumn = columnKey === 'started' || columnKey === 'queued';

  let effectiveSlotStyle = {};
  let slotClasses = ['kanban-slot'];
  let headerStyle = {};

  if (isDynamicSlotColumn) {
    // Styles for "Next" (queued) or "Ongoing" (started) column slots
    slotClasses.push('pitch-slot')
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
          <div className="slot-status-light">
            {columnKey === 'started' && isMatchInProgress && (
              <MinuteClock duration={20} max={40} startTime="now" />
            )}
            {(() => {
              let lightStatus = 'unavailable'; // Default to orange light
              if (isMatchInProgress) {
                if (columnKey === 'queued') {
                  lightStatus = 'ready'; // Green light for "Next" column if match is ready
                } else if (columnKey === 'started') {
                  lightStatus = 'in-progress'; // Red light for "Ongoing" column
                }
              } else if (showWarningIcon) {
                // This warning is for empty "Ongoing" slots when other matches are planned for that pitch
                lightStatus = 'warning'; // Orange light
              }
              // 'unavailable' status (e.g. "NO MATCH READY" in "Next", or empty "Ongoing" with no warning) will also use orange
              return <OnAirLight status={lightStatus} />;
            })()}
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
