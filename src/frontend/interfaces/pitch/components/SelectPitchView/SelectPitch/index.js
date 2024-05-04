import React from "react";
import { useNavigate } from "react-router-dom";

const SelectPitch = ({
  pitch,
  type,
  location,
  category,
  team1,
  team2,
  scheduledTime,
  onChoosePitch,
}) => {
  const navigate = useNavigate();
  const navigateToPitch = () => {
    onChoosePitch();
    navigate(`/pitch/${pitch}`);
  };

  return (
    <div
      className="allDone selectPitch"
      onClick={navigateToPitch}
    >
      <div className="header">
        <div className="pitch">{pitch}</div>
        <div className="location">{location}</div>
        <div className="type">{type?.toUpperCase()}</div>
      </div>
      {category ? (
        <div>
          <div className="nextUp">NEXT UP:</div>
          <div className="details">
            <div className="category">{category}</div>
            <div className="time">{`@${scheduledTime}`}</div>
          </div>
          <div className="teams">
            <div className="team1">{team1}</div>
            <div>vs</div>
            <div className="team2">{team2}</div>
          </div>
        </div>
      ) : (
        <div className="noMoreFixtures">
          <div>All scheduled games complete!</div>
        </div>
      )}
    </div>
  );
};

export default SelectPitch;
