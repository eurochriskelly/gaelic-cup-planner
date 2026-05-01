import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './TimeDisplay.scss';

const TimeDisplay = ({
  scheduledTime,
  startedTime = null,
  started = null,
  durationPlanned = null,
  isOngoing = false,
  showSlackControls = false,
  slackMinutes = 0,
  onAdjustSlack,
}) => {
  // Calculate countdown time remaining
  const getTimeRemaining = useCallback(() => {
    if ((!startedTime && !started) || !durationPlanned || !isOngoing) return null;
    
    try {
      const now = new Date();
      let startedDate;
      
      if (started) {
        // Use full ISO timestamp if available (e.g., "2023-11-17T12:18:42.000Z")
        startedDate = new Date(started);
      } else {
        // Fallback to startedTime (e.g., "13:18") - assumes today
        const [hours, minutes] = startedTime.split(':').map(num => parseInt(num, 10));
        startedDate = new Date();
        startedDate.setHours(hours, minutes, 0, 0);
      }
      
      const elapsedMs = now - startedDate;
      const elapsedMinutes = Math.floor(elapsedMs / 60000);
      const remainingMinutes = durationPlanned - elapsedMinutes;
      
      const absMinutes = Math.abs(remainingMinutes);
      const hours = Math.floor(absMinutes / 60);
      const mins = absMinutes % 60;
      
      let timeText = '';
      if (hours > 0) {
        timeText = `${hours}h${mins > 0 ? mins + 'm' : ''}`;
      } else {
        timeText = `${mins}m`;
      }
      
      // Negative sign for time remaining, positive for overtime
      const sign = remainingMinutes >= 0 ? '-' : '+';
      
      return {
        text: `${sign}${timeText}`,
        isOver: remainingMinutes < 0,
        remainingMinutes
      };
    } catch (e) {
      console.error('Error calculating countdown:', e);
      return null;
    }
  }, [startedTime, durationPlanned, isOngoing]);

  const [countdown, setCountdown] = useState(getTimeRemaining());

  // Update countdown every minute
  useEffect(() => {
    if (!isOngoing || !startedTime || !durationPlanned) return;
    
    // Update immediately
    setCountdown(getTimeRemaining());
    
    // Update every minute
    const intervalId = setInterval(() => {
      setCountdown(getTimeRemaining());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [isOngoing, startedTime, durationPlanned, getTimeRemaining]);

  // Function to calculate the time difference and return a friendly format
  const getTimeDifference = () => {
    if (!scheduledTime || !startedTime) return null;
    
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
      return hours * 60 + minutes;
    };
    
    try {
      const scheduledMinutes = parseTime(scheduledTime);
      const startedMinutes = parseTime(startedTime);
      const diffMinutes = scheduledMinutes - startedMinutes;
      
      const hours = Math.floor(Math.abs(diffMinutes) / 60);
      const minutes = Math.abs(diffMinutes) % 60;
      
      let diffText = '';
      const sign = diffMinutes > 0 ? '+' : '-';
      
      if (hours > 0) {
        diffText = `${sign}${hours}h${minutes > 0 ? minutes + 'm' : ''}`;
      } else {
        diffText = `${sign}${minutes}m`;
      }
      
      return {
        text: diffText,
        isAhead: diffMinutes > 0,
      };
    } catch (e) {
      console.error('Error parsing time:', e);
      return null;
    }
  };
  
  const formatDuration = (minutes) => {
    if (!minutes || minutes <= 0) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? mins + 'm' : ''}`;
    }
    return `${mins}m`;
  };

  const timeDiff = getTimeDifference();
  const plannedDuration = durationPlanned ? formatDuration(durationPlanned) : null;

  return (
    <div className={`time-display ${showSlackControls ? 'with-slack-controls' : ''}`}>
      <div className="clock-stack">
        {showSlackControls && (
          <button
            type="button"
            className="slack-button slack-button-plus"
            onClick={(event) => {
              event.stopPropagation();
              onAdjustSlack?.(5);
            }}
            aria-label="Add 5 minutes slack"
          >
            + 5m
          </button>
        )}
        <svg className="clock-icon" viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <polyline points="12,6 12,12 16,14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {showSlackControls && (
          <button
            type="button"
            className="slack-button slack-button-minus"
            onClick={(event) => {
              event.stopPropagation();
              onAdjustSlack?.(-5);
            }}
            aria-label="Reduce slack by 5 minutes"
          >
            - 5m
          </button>
        )}
      </div>
      <div className="time-text">
        <span className="scheduled-time">{scheduledTime}</span>
        <span className="match-duration">[{plannedDuration || '?m'}]</span>
        {showSlackControls && slackMinutes !== 0 && (
          <span className={`slack-delta ${slackMinutes > 0 ? 'positive' : 'negative'}`}>
            {slackMinutes > 0 ? '+' : ''}{slackMinutes}m
          </span>
        )}
        {isOngoing && countdown && (
          <span className={`countdown ${countdown.isOver ? 'overtime' : 'remaining'}`}>
            ({countdown.text})
          </span>
        )}
        {!isOngoing && startedTime && (
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
  startedTime: PropTypes.string,
  started: PropTypes.string,
  durationPlanned: PropTypes.number,
  isOngoing: PropTypes.bool,
  showSlackControls: PropTypes.bool,
  slackMinutes: PropTypes.number,
  onAdjustSlack: PropTypes.func
};


export default TimeDisplay;
