import React from "react";
import { useNavigate } from "react-router-dom";

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

function TeamNameDisplay({
  team,
  number
}) {
  let displayTeam = team
  if (team.startsWith('~')) {
    // e.g. "~match:102/p:1"
    const parts = team.replace('~', '').split('/')
    const dependent = parts[0]
    const position = +(parts[1].replace('p:', ''))
    const [ type, order ] = dependent.split(':')
    const outcome = order === 1 ? 'Winner' : 'Loser'
    switch (type) {
      case 'match':
        displayTeam = `${outcome} of FIXTURE #${position}`
        break
      case 'semis':
      case 'finals':
      case 'quarters':
        displayTeam = `${outcome} of ${type.toUpperCase()} #${position}`
        break
      default: 
        displayTeam =  'T.B.D.'
        break
    }
  }
  return <div className={`team${number}`}>{displayTeam}</div>
}

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
