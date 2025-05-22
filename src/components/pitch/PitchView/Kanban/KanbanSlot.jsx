import PitchIcon from "../../../../shared/icons/icon-pitch-2.svg?react";
import './KanbanSlot.scss';

// A simple warning triangle SVG component
const WarningIcon = () => (
  <svg viewBox="0 0 100 100" width="36" height="36" className="warning-icon">
    <polygon points="50,10 90,90 10,90" />
  </svg>
);

const KanbanSlot = ({ slotIndex, columnIndex, children, slotBackgroundColor, pitchName, showWarningIcon }) => {
  // Determine color class for default gray slots
  // This is only applied if slotBackgroundColor is not provided.
  const colorClass = !slotBackgroundColor && (columnIndex + slotIndex) % 2 === 0 ? 'gray1' : 'gray2';

  let slotStyle = {};
  if (slotBackgroundColor) {
    const stripeGray = '#E0E0E0'; // Light gray for the stripes
    slotStyle = {
      background: `repeating-linear-gradient(
        45deg,
        ${slotBackgroundColor},
        ${slotBackgroundColor} 10px,
        ${stripeGray} 10px,
        ${stripeGray} 20px
      )`
    };
  }

  return (
    <div
      className={`kanban-slot ${slotBackgroundColor ? '' : colorClass}`}
      style={slotStyle}
    >
      {children ? (
        children // Render the KanbanCard if it exists
      ) : pitchName ? ( // Otherwise, if pitchName is provided, display it
        <div className="slot-pitch-name">
          <div className="pitch-identifier">
            <PitchIcon width={219*0.4} height={159*0.4} />
            <span>{pitchName}</span>
          </div>
          <div className="slot-status-text">
            {showWarningIcon && <WarningIcon />}
            {showWarningIcon 
                ? <span class="warn">NO ACTIVE MATCH</span>
                : <span class="no-warn">NO MORE MATCHES</span>
              }
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default KanbanSlot;
