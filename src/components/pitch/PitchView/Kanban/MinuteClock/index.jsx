import { useState, useEffect, useCallback } from 'react';
import './MinuteClock.scss';

const MinuteClock = ({ duration, max, startTime: startTimeProp }) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const parseStartTime = useCallback(() => {
    if (startTimeProp === "now" || !startTimeProp) {
      return new Date();
    }
    // Assuming startTimeProp is "HH:MM"
    const [hours, minutes] = startTimeProp.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }, [startTimeProp]);

  const [internalStartTime, setInternalStartTime] = useState(parseStartTime);

  useEffect(() => {
    // If startTimeProp changes and is not "now", update internalStartTime
    if (startTimeProp && startTimeProp !== "now") {
      setInternalStartTime(parseStartTime());
    }
  }, [startTimeProp, parseStartTime]);


  useEffect(() => {
    const calculateElapsed = () => {
      const now = new Date();
      const diffMs = now.getTime() - internalStartTime.getTime();
      const currentElapsed = Math.floor(diffMs / 60000); // Convert ms to minutes
      setElapsedMinutes(Math.min(currentElapsed, max)); // Cap at max
    };

    calculateElapsed(); // Initial calculation
    const intervalId = setInterval(calculateElapsed, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, [internalStartTime, max]);

  const percentage = (elapsedMinutes / max) * 100;
  let gradientStyle = {};

  const colorLightBlue = '#ADD8E6';
  const colorLightOrange = '#FFD580';
  const colorLightPink = '#FFB6C1';
  const colorTransparent = 'transparent';

  const p50 = (max / 2 / max) * 100; // 50%
  const p75 = (max * 0.75 / max) * 100; // 75%

  if (elapsedMinutes <= 0) {
    gradientStyle.background = colorTransparent;
  } else if (elapsedMinutes <= max / 2) {
    gradientStyle.background = `conic-gradient(${colorLightBlue} 0% ${percentage}%, ${colorTransparent} ${percentage}% 100%)`;
  } else if (elapsedMinutes <= max * 0.75) {
    gradientStyle.background = `conic-gradient(${colorLightBlue} 0% ${p50}%, ${colorLightOrange} ${p50}% ${percentage}%, ${colorTransparent} ${percentage}% 100%)`;
  } else { // elapsedMinutes > max * 0.75
    gradientStyle.background = `conic-gradient(${colorLightBlue} 0% ${p50}%, ${colorLightOrange} ${p50}% ${p75}%, ${colorLightPink} ${p75}% ${percentage}%, ${colorTransparent} ${percentage}% 100%)`;
  }

  return (
    <div className="minute-clock-container">
      <div className="minute-clock-face">
        <div className="minute-clock-pie" style={gradientStyle}></div>
        <div className="minute-clock-text">
          {elapsedMinutes}'
        </div>
      </div>
    </div>
  );
};

export default MinuteClock;
