import React from "react";
import { useNavigate } from "react-router-dom";
import TeamNameDisplay from "../../common/TeamNameDisplay";

const SelectPitch = ({
  pitch,
  type,
  location,
  category,
  team1,
  team2,
  matchId,
  scheduledTime,
  startedTime = null,
  onChoosePitch,
}) => {
  const navigate = useNavigate();
  const navigateToPitch = () => {
    onChoosePitch();
    navigate(`/tournament/7/pitch/${pitch}`);
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
          <NextGameTitle match={matchId} started={startedTime} />
          <div className="details">
            <div className="category">{category}</div>
            <div className="time">{`@${scheduledTime}`}</div>
          </div>
          <div className="teams">
            <TeamNameDisplay number={1} team={team1} />
            <div>vs</div>
            <TeamNameDisplay number={2} team={team2} />
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


function NextGameTitle({
  started,
  match
}) {
  const showMatchNumber = () => {
    let matchstr = ''
    if (match) {
      matchstr = `: fixture(${match})`
    }
    return <i>{matchstr}</i>
  }
  return (
    <div className="play">{
      started
      ? <span className="inProgress">In progress {showMatchNumber()}</span>
      : <span className="nextUp">Next up {showMatchNumber()}</span>
    }</div>
  )
}
