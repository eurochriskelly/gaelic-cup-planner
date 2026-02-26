import './PitchSelector.scss';
import PitchIcon from "../../../../shared/icons/icon-pitch-2.svg?react";

const PitchSelector = ({ pitches, selectedPitch, onSelectPitch }) => {
  return (
    <div className="pitch-selector">
      {pitches.map((pitch) => (
        <button
          key={pitch}
          className={`pitch-tab ${selectedPitch === pitch ? 'active' : ''}`}
          onClick={() => onSelectPitch(pitch)}
        >
          <div className="pitch-icon-wrapper">
             <PitchIcon width={80} height={60} />
          </div>
          <span className="pitch-name">{pitch}</span>
        </button>
      ))}
    </div>
  );
};

export default PitchSelector;
