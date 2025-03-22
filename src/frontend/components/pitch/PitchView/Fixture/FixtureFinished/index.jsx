import { extractUppercaseAndNumbers } from '../common';
import { formatTeamName } from "../../../../../shared/generic/TeamNameDisplay";
import './FixtureFinished.scss';

export default FixtureFinished;

function FixtureFinished({fixture}) {
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
    const classes = ['grid grid-columns-2 match-area'];
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
    gridTemplateRows: 'auto auto',
  }

  return (
    <div className="FixtureFinished" key={id}>
      <div className="fixture-info">
        <div className="text-3xl font-bold mb-4">
          <span>{category}</span>
          <span className="text-rose-500">#</span>
          <span>{`${id}`.substr(-3)}</span>
        </div>
        <div className="mb-4 text-xl">
          Stage: {stage
            .toUpperCase()
            .replace('PLT', 'Plate')
            .replace('CUP', 'Cup')
            .replace('SHD', 'Shield')
            .replace('_', '/')}
        </div>
      </div>

      <div className="fixture-pairing">
        <div className="team-row">
          <div className="team-icon team1">
            {extractUppercaseAndNumbers(team1).substring(0, 2)}
          </div>
          <div className="team-name">
            {formatTeamName(team1)}
          </div>
        </div>

        <div className="team-row">
          <div className="team-icon team2">
            {extractUppercaseAndNumbers(team2).substring(0, 2)}
          </div>
          <div className="team-name">
            {formatTeamName(team2)}
          </div>
        </div>

        {!played && umpireTeam && (
          <div className="umpires">
            <b>UMPIRING: </b>
            {formatName(umpireTeam)}
          </div>
        )}
      </div>

      <div className="score-column">
        <div className="score-placeholder">
          SCORE
        </div>
      </div>
    </div>
  );
}

function FixtureInfo({
  scheduledTime,
  startedTime,
  delayMinutes = 0,
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
      <div className="text-3xl font-bold mb-4">
        <span>{group}</span>
        <span className="text-rose-500">#</span>
        <span>{`${fixtureId}`.substr(-3)}</span>
      </div>
      <div className="mb-4 text-xl">
        Stage: {stage
          .toUpperCase()
          .replace('PLT', 'Plate')
          .replace('CUP', 'Cup')
          .replace('SHD', 'Shield')
          .replace('_', '/')}
      </div>
    </div>
  )
}

