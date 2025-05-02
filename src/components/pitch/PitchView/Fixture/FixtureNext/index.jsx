import { formatTeamName, militaryTimeDiffMins } from "../../../../../shared/generic/TeamNameDisplay";
import ClockIcon from "../../../../../shared/generic/ClockIcon";
import UmpiresIcon from "../../../../../shared/icons/icon-umpires.svg?react";
import '../../../../../components/web/gaelic-score.js';
import '../../../../../components/web/logo-box.js';
import '../../../../../components/web/team-name.js';
import '../Fixture.scss';
import './FixtureNext.scss';

export default FixtureNext;

function FixtureNext({ fixture }) {
  const {
    id,
    startedTime = "",
    scheduledTime = "",
    stage,
    category,
    team1,
    team2,
    umpireTeam,
  } = fixture;

  // Check if all score values are valid integers (directly from fixture)
  const hasScores = typeof fixture.goals1 === 'number' &&
    typeof fixture.goals2 === 'number' &&
    typeof fixture.points1 === 'number' &&
    typeof fixture.points2 === 'number' &&
    !isNaN(fixture.goals1) &&
    !isNaN(fixture.goals2) &&
    !isNaN(fixture.points1) &&
    !isNaN(fixture.points2);

  const tlen = 24;

  const rowClasses = () => {
    const classes = ['grid grid-columns-2 '];
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
    display: 'grid',
  }
  return (
    <div className={`fixture FixtureNext h-128`} key={id}>
      <div
        className={rowClasses()}
        style={gridStyle}>
        <FixtureInfo
          scheduledTime={scheduledTime}
          startedTime={startedTime}
          delayMinutes={militaryTimeDiffMins(scheduledTime, startedTime)}
          stage={stage}
          group={category}
          fixtureId={id}
          fixture={fixture}
        />

        <section className="mt-7 mr-0 pr-0">
          <div className="bg-white p-6 pt-12 ml-12 mr-12 rounded-3xl border-solid border-8 border-gray-300" style={{ height: "46rem" }}>
            <div className="match-up w-full min-h-52">
              <div/>
              <div className="team team-1">
                <logo-box title={team1} size="140px" border-color="#e11d48"></logo-box>
              </div>
              <div className="text-6xl">vs.</div>
              <div className="team team-2">
                <logo-box title={team2} size="140px" border-color="#38bdf8"></logo-box>
              </div>
              <div/>
            </div>

            <div className="match-teams">
              <div/>
              <div className="text-3xl">{formatTeamName(team1)}</div>
              <div/>
              <div className="text-3xl">{formatTeamName(team2)}</div>
              <div/>
            </div>

            {hasScores && (
              <div className="match-scores mt-8">
                <div />
                <div className="team-score team1-score">
                  <gaelic-score
                    goals={fixture.goals1}
                    points={fixture.points1}
                    layout="over"
                    scale="2.2"
                    played="true"
                  ></gaelic-score>
                </div>
                <div />
                <div className="team-score team2-score">
                  <gaelic-score
                    goals={fixture.goals2}
                    points={fixture.points2}
                    layout="over"
                    scale="2.2"
                    played="true"
                  ></gaelic-score>
                </div>
                <div />
              </div>
            )}
          </div>
          {(
            <div className='umpires'>
              {umpireTeam ? (
                < >
                  <UmpiresIcon width="82" height="82" />
                  <team-name name={umpireTeam} show-logo="true" direction="r2l" height="35px"></team-name>
                </>
              ) : (
                ""
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FixtureInfo({
  scheduledTime,
  startedTime,
  delayMinutes = 0,
  stage,
  group,
  fixtureId,
  fixture,
}) {
  return (
    <div className="FixtureInfo" onClick={() => console.log(fixture)}>
      <ClockIcon
        scheduled={scheduledTime}
        started={startedTime}
        delay={delayMinutes}
        focus={focus}
        played={false}
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
          .replace('CUP', 'Cup')
          .replace('SHD', 'Shield')
          .replace('_', '/')}
      </div>
    </div>
  );
}

