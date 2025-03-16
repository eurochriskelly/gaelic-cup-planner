import TeamResult from "./TeamResult";
import { formatTeamName, militaryTimeDiffMins } from "../../../../shared/generic/TeamNameDisplay";
import ClockIcon from "../../../../shared/generic/ClockIcon";
import './Fixture.scss';

const Fixture = ({ fixture, isFocus }) => {
  const {
    id,
    startedTime = "",
    scheduledTime = "",
    stage,
    category,
    team1,
    goals1,
    points1,
    team2,
    goals2,
    points2,
    played,
    umpireTeam,
  } = fixture;

  const tlen = 24;

  const totalTeam1 = (goals1 || 0) * 3 + (points1 || 0);
  const totalTeam2 = (goals2 || 0) * 3 + (points2 || 0);
  let winner = null;
  if (played) {
    winner = totalTeam1 > totalTeam2 ? team1 : totalTeam1 < totalTeam2 ? team2 : "";
  }

  const scoreUpToDate = !!played;
  const rowClasses = () => {
    const classes = [];
    if (scoreUpToDate) classes.push("scoreUpToDate");
    return classes.join(" ");
  };

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
    <div className={`fixture ${isFocus ? 'focusFixture' : ""}`} key={id}>
      <div
        className={rowClasses()}
        style={{ backgroundColor: scoreUpToDate ? "#bcc6bc" : "" }}>
        <FixtureInfo
          scheduledTime={scheduledTime}
          startedTime={startedTime}
          delayMinutes={militaryTimeDiffMins(scheduledTime, startedTime)}
          focus={focus}
          scoreUpToDate={scoreUpToDate}
          stage={stage}
          group={category}
          fixtureId={id}
        />

        <div className="match-up">
          <div className="team team-1">
            <div className="text-7xl bg-rose-500">T1</div>
            <div className="text-1xl">{formatTeamName(team1)}</div>
          </div>
          <div className="text-2xl">vs.</div>
          <div className="team team-2">
            <div className="text-7xl bg-blue-400">T2</div>
            <div className="text-1xl">{formatTeamName(team2)}</div>
          </div>
        </div>
        {!played && (
          <div className='umpires'>
            {umpireTeam ? (
              <span>
                <b>UMPIRING: </b>
                {formatName(umpireTeam)}
              </span>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fixture;

function FixtureInfo({
  scheduledTime,
  startedTime,
  delayMinutes = 0,
  focus,
  scoreUpToDate,
  stage,
  group,
  fixtureId
}) {
  return (
    <div className="FixtureInfo">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <ClockIcon
            scheduled={scheduledTime}
            started={startedTime}
            delay={delayMinutes}
            focus={focus}
            played={scoreUpToDate}
          />
          <span className="text-2xl">{scheduledTime}</span>
        </div>
        <div className="text-xl">matchId: {fixtureId}</div>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{group}</span>
        </div>
        <div className="text-xl">
          State: {stage
            .toUpperCase()
            .replace('PLT', 'Plate')
            .replace('SHD', 'Shield')
            .replace('_', '/')}
        </div>
      </div>
    </div>
  )
}
