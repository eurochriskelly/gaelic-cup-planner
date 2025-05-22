import PropTypes from 'prop-types';
import './TimeDisplay.scss';

const TimeDisplay = ({ 
  scheduledTime,
  startedTime = null
}) => {
  // Function to calculate the time difference and return a friendly format
  const getTimeDifference = () => {
    if (!scheduledTime || !startedTime) return null;
    
    // Convert times to comparable format (assuming same day)
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
      return hours * 60 + minutes; // Convert to minutes since start of day
    };
    
    try {
      const scheduledMinutes = parseTime(scheduledTime);
      const startedMinutes = parseTime(startedTime);
      
      // Calculate time difference in minutes
      const diffMinutes = scheduledMinutes - startedMinutes;
      
      // Format the difference
      const hours = Math.floor(Math.abs(diffMinutes) / 60);
      const minutes = Math.abs(diffMinutes) % 60;
      
      let diffText = '';
      
      // Add sign based on whether we are ahead or behind schedule
      const sign = diffMinutes > 0 ? '+' : '-';
      
      // Format the display text
      if (hours > 0) {
        diffText = `${sign}${hours}h${minutes > 0 ? minutes + 'm' : ''}`;
      } else {
        diffText = `${sign}${minutes}m`;
      }
      
      return {
        text: diffText,
        isAhead: diffMinutes > 0, // Positive means ahead of schedule
      };
    } catch (e) {
      console.error('Error parsing time:', e);
      return null;
    }
  };
  
  const timeDiff = getTimeDifference();
  
  return (
    <div className="time-display">
      <svg className="clock-icon" viewBox="0 0 24 24" width="35" height="35" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <polyline points="12,6 12,12 16,14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="time-text">
        <span className="scheduled-time">{scheduledTime}</span>
        {startedTime && (
          <span className={`started-time ${timeDiff ? (timeDiff.isAhead ? 'ahead' : 'behind') : ''}`}>
            ({timeDiff ? timeDiff.text : startedTime})
          </span>
        )}
      </div>
    </div>
  );
};

TimeDisplay.propTypes = {
  scheduledTime: PropTypes.string.isRequired,
  startedTime: PropTypes.string
};


export default TimeDisplay;
