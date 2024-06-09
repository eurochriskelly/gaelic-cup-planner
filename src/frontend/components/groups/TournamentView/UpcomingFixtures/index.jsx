import { getDivisions } from "../../../../shared/js/styler";

import "./UpcomingFixtures.scss";

const UpcomingFixtures = ({ isPhone, groups, nextMatches }) => {
  const liveStyle = isPhone
    ? { gridTemplateColumns: getDivisions(groups.length) }
    : null;
  // We show a maximum of 3 groups
  const nextGroups = groups.slice(0, 3);
  return (
    <article style={liveStyle} className="upcomingFixtures">
      {isPhone ? <h2>Upcoming fixtures</h2> : null}
      {nextGroups.map((group, id) => {
        let candidateMatches = (nextMatches || [])
          .filter((match) => match.category === group)
          .slice(0, 3);

        const showMatches = {
          previous: candidateMatches.filter(
            (m) => typeof m.goals1 === "number" && m.startedTime
          ),
          current: candidateMatches.filter(
            (m) => typeof m.goals1 !== "number" && m.startedTime
          ),
          next: candidateMatches.filter(
            (m) => typeof m.goals1 !== "number" && !m.startedTime
          ),
        };
        const showOrEmpty = (title, arr = [], T) => {
          return (
            <tbody>
              <tr>
                <td colSpan={4} className="groupHeader">
                  {title}
                </td>
              </tr>
              {arr.length ? (
                arr?.map((m, i) => <T key={`m${i}`} match={m} />)
              ) : (
                <T match={null} />
              )}
            </tbody>
          );
        };
        return (
          <section key={`k${id}`}>
            <table>
              {showOrEmpty(
                "Last played",
                showMatches.previous,
                MatchLastPlayed
              )}
              {showOrEmpty("In progress", showMatches.current, MatchInProgress)}
              {showOrEmpty("Next up", showMatches.next, MatchUpcoming)}
            </table>
          </section>
        );
      })}
    </article>
  );
};

export default UpcomingFixtures;

function Row({ type = "played", children }) {
  return (
    <tr className={`nextArea area-${type}`}>
      <td>
        {" "}
        <div>{children}</div>{" "}
      </td>
    </tr>
  );
}

function MatchLastPlayed({ match }) {
  if (!match) return <Row type="played">No matches finished in group yet.</Row>;
  const { 
    scheduledTime, team1, team2, grp, pitch,
    goals1, goals2, points1, points2 } = match;
  console.log(match)
  const pad0 = str => `0${str}`.substring(-2)
  return (
    <Row>
      <table>
        <colgroup>
          <col style={{width:'10%'}} />
          <col style={{width:'auto'}} />
          <col style={{width:'10%'}} />
        </colgroup>
        <tbody>
          <tr>
            <td>{scheduledTime}</td>
            <td style={{textAlign:'center'}}>{
              `Group [${grp}], pitch [${pitch}]`
            }</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>{team1}</td>
            <td>{goals1}-{pad0(points1)}</td>
          </tr>
          <tr>
            <td></td>
            <td>{team2}</td>
            <td>{goals2}-{pad0(points2)}</td>
          </tr>
        </tbody>
      </table>
    </Row>
  );
}

function MatchInProgress({ match }) {
  if (!match) return <Row type="inprogress"> No match in progress.</Row>;
  const { scheduledTime, team1, team2, grp, pitch } = match;
  return (
    <Row type="inprogres">
      <table>
        <colgroup>
          <col style={{width:'10%'}} />
          <col style={{width:'auto'}} />
          <col style={{width:'10%'}} />
        </colgroup>
        <tbody>
          <tr>
            <td>{scheduledTime}</td>
            <td style={{textAlign:'center'}}>{
              `Group [${grp}], pitch [${pitch}]`
            }</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>{team1}</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>{team2}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </Row>
  );
}

function MatchUpcoming({ match }) {
  if (!match) return <Row type="nextup">No match in progress.</Row>;
  const { scheduledTime, team1, team2, umpireTeam, grp, pitch } = match;
  return (
    <Row type="nextup">
      <table>
        <colgroup>
          <col style={{width:'10%'}} />
          <col style={{width:'auto'}} />
          <col style={{width:'10%'}} />
        </colgroup>
        <tbody>
          <tr>
            <td>{scheduledTime}</td>
            <td style={{textAlign:'center'}}>{
              `Group [${grp}], pitch [${pitch}]`
            }</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>{team1}</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>{team2}</td>
            <td></td>
          </tr>
          <tr>
            <td>UMP</td>
            <td>{umpireTeam}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </Row>
  );
}
