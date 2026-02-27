import { useEffect, useState } from 'react';
import './PitchSelector.scss';
import PitchIcon from "../../../../shared/icons/icon-pitch-2.svg?react";
import OnAirLight from './OnAirLight';

const PitchSelector = ({
  pitches,
  selectedPitch,
  onSelectPitch,
  pitchStatuses = {},
}) => {
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const getLiveMinutes = (status) => {
    if (!status?.liveStartedAtMs) return null;
    return Math.max(0, Math.floor((nowMs - status.liveStartedAtMs) / 60000));
  };

  return (
    <div className="pitch-selector">
      {pitches.map((pitch) => {
        const status = pitchStatuses[pitch] || {};
        const isLive = !!status.hasLiveMatch;
        const liveMinutes = getLiveMinutes(status);

        return (
          <button
            key={pitch}
            className={`pitch-tab ${selectedPitch === pitch ? 'active' : ''}`}
            onClick={() => onSelectPitch(pitch)}
          >
            <div className="pitch-icon-wrapper">
              <PitchIcon width={80} height={60} />
            </div>
            <span className="pitch-name">{pitch}</span>

            <div className="pitch-status-line">
              <span className="on-air-group">
                <OnAirLight status={isLive ? 'in-progress' : 'offline'} />
                <span className={`on-air-text ${isLive ? 'live' : 'idle'}`}>
                  {isLive ? 'IN PLAY' : 'NO MATCH'}
                </span>
              </span>
              <span className="live-minutes">
                {isLive && typeof liveMinutes === 'number' ? `${liveMinutes}m` : '--'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PitchSelector;
