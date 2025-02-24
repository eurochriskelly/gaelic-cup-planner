import { formatTeamName, militaryTimeDiffMins } from "../../../../shared/generic/TeamNameDisplay";
import ClockIcon from "../../../../shared/generic/ClockIcon";
import ScoreDisplay from "../../../../shared/generic/ScoreDisplay";
import './Focused.scss';
import { func } from "prop-types";

const Focused = ({
  fixture,
  fixtures,
  updateFixtures,
  startMatch
}) => {
  const {
    id,
    startedTime = "",
    scheduledTime = "",
    pitch, stage, category,
    team1, goals1, points1,
    team2, goals2, points2,
    umpireTeam,
    referee = 'N/A',
    played,
  } = fixture;

  const totalTeam1 = (goals1 || 0) * 3 + (points1 || 0);
  const totalTeam2 = (goals2 || 0) * 3 + (points2 || 0);
  let winner = null;
  if (played) {
    winner = totalTeam1 > totalTeam2 ? team1 : totalTeam1 < totalTeam2 ? team2 : "";
  }
  return (
    <div className={`m-0 p-0 focused`} key={id}>
      <div>
        <FixtureInfo
          scheduledTime={scheduledTime}
          startedTime={startedTime}
          delayMinutes={militaryTimeDiffMins(scheduledTime, startedTime)}
          focus={focus}
          scoreUpToDate={false}
          stage={stage}
          group={category}
        />
        
        <Contenders>
          <TeamResult goals={goals1} points={points1} team={team1} winner={winner} played={played} />
          <TeamResult goals={goals2} points={points2} team={team2} winner={winner} played={played} />
        </Contenders>

        <div className='prop-section bg-blue'>
          <ChangeProperty label='UMPIRES' name={umpireTeam} />
          <ChangeProperty label='REFEREE' name={referee} />
          <ChangeProperty label='PITCH' name={pitch} />
        </div>
      </div>
    </div>
  );
};

export default Focused;

function ChangeProperty({
  name = '',
  label
}) {
  const tlen = 24;
  const formatName = (name, winner) => {
    if (name.startsWith("~")) {
      return formatTeamName(name);
    }
    return (
      (winner ? "🏅" : "") +
      (" " + name.length > tlen ? name.substring(0, tlen) + "..." : name)
    );
  };
  return (
    <div className={`prop prop-${label.toLowerCase()} p-4 m-2 mt-4`}>
      <span className="text-4xl grid grid-cols-3 grid-flow-col gap-3">
        <i>{label}: </i>
        <b>{formatName(name)}</b>
        <button className="text-5xl">...</button>
      </span>
    </div>
  )
}

function FixtureInfo({
  scheduledTime,
  startedTime,
  delayMinutes = 0,
  focus,
  scoreUpToDate,
  stage,
  group
}) {
  const categoryLabel = () => group?.replace(/[^A-Z0-9]/g, "");
  return (
    <div className="focusedInfo">
      <div className="w-full">
        <span>
          <span>{group}</span>
        </span>
        <span>{
          stage
            .toUpperCase()
            .replace('PLT', 'Plate')
            .replace('SHD', 'Shield')
            .replace('_', '/')
        }</span>
      </div>
      <div>
        <ClockIcon
          scheduled={scheduledTime}
          started={startedTime}
          delay={delayMinutes}
          focus={focus}
          played={scoreUpToDate}
        />
        <div></div>
        <button className="text-green-900">
          <i className='pi pi-play-circle'></i>
        </button>
        <button className="text-red-700">
          <i className='pi pi-times-circle'></i>
        </button>
        <button className="text-slate-300">
          <i className='pi pi-calendar-clock'></i>
        </button>
      </div>
    </div>
  )
}

function Contenders({
  cardInfo = [],
  children
}) {
  const childrenArray = React.Children.toArray(children);
  const TeamBox = ({ children }) => {
    return (
      <div>
        <div className="text-5xl">{children}</div>
        <div>Cards</div>
      </div>
    )
  }

  return (
    <div className='text-red-600 bg-white m-3' style={{ minHeight: '500px' }}>
      <TeamBox>{childrenArray[0]}</TeamBox>
      <div className="text-red">VS.</div>
      <TeamBox>{childrenArray[1]}</TeamBox>
    </div>
  )
}

function TeamResult({
  team,
  goals,
  points,
  played,
  winner,
  showScore = true
}) {
  const isWinner = winner === team
  return (
    <div className='TeamResult'>
      <div className={(isWinner ? 'winner' : 'loser') + " teamName"}>
        <span className='team-icon'>&nbsp;</span>
        <span>{formatTeamName(team, isWinner)}</span>
      </div>
      {showScore && <ScoreDisplay goals={goals} points={points} played={played} />}
    </div>
  )
}
