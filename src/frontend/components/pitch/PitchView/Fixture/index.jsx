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
    const classes = ['grid grid-columns-2 '];
    if (!isFocus) classes.push('match-area')
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
  const gridStyle = { 
    backgroundColor: scoreUpToDate ? "#bcc6bc" : "",
    display: 'grid',
  }
  if (isFocus) {
    gridStyle.gridTemplateRows = 'auto auto'
  } else {
    gridStyle.gridTemplateColumns = 'auto auto'
  }
  return (
    <div className={`fixture h-128`} key={id}>
      <div
        className={rowClasses()}
        style={gridStyle}>
        <FixtureInfo
          scheduledTime={scheduledTime}
          startedTime={startedTime}
          delayMinutes={militaryTimeDiffMins(scheduledTime, startedTime)}
          focus={isFocus}
          scoreUpToDate={scoreUpToDate}
          stage={stage}
          group={category}
          fixtureId={id}
        />

        <section className="mt-7 mr-0 pr-0">
          <div className="bg-white p-6 pt-12 ml-12 mr-12 rounded-xl">
            <div className="match-up w-full">
              <div/>
              <div className="team team-1">
                <div className="team-icon text-6xl bg-rose-500 pt-10">{extractUppercaseAndNumbers(team1).substring(0, 3)}</div>
              </div>
              <div className="text-6xl">vs.</div>
              <div className="team team-2">
                <div className="text-6xl bg-blue-400 team-icon pt-10">{extractUppercaseAndNumbers(team2).substring(0, 3)}</div>
              </div>
              <div/>
            </div>

            <div className="match-teams ">
              <div/>
              <div className="text-3xl">{formatTeamName(team1)}</div>
              <div/>
              <div className="text-3xl">{formatTeamName(team2)}</div>
              <div/>
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
        </section>
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
      <ClockIcon
        scheduled={scheduledTime}
        started={startedTime}
        delay={delayMinutes}
        focus={focus}
        played={scoreUpToDate}
      />
      <div className="text-4xl">
        <span>{group}</span>
        <span className="text-rose-500">#</span>
        <span>{`${fixtureId}`.substr(-3)}</span>
      </div>
      <div className="mb-4 text-xl">
        Stage: {stage
          .toUpperCase()
          .replace('PLT', 'Plate')
          .replace('SHD', 'Shield')
          .replace('_', '/')}
      </div>
    </div>
  )
}

function extractUppercaseAndNumbers(name) {
    return name.match(/[A-Z0-9]/g)?.join('') || '';
}
