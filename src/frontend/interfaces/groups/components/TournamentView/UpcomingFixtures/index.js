import React from "react";
import { getDivisions } from "../../../../../shared/js/styler";

import "./UpcomingFixtures.css";

const UpcomingFixtures = ({
  isPhone,
  groups,
  nextMatches
}) => {
  const liveStyle = isPhone ? { gridTemplateColumns: getDivisions(groups.length) } : null;
  // We show a maximum of 3 groups
  const nextGroups = groups.slice(0, 3);
  return (
    <article style={liveStyle} className="upcomingFixtures">
      {isPhone ? <h2>Upcoming fixtures</h2> : null}
      {nextGroups
        .map((group, id) => {
          let candidateMatches = (nextMatches || [])
            .filter((match) => match.category === group)
            .slice(0, 3);

          const showMatches = {
            previous: candidateMatches
              .filter((m) => typeof m.goals1 === "number" && m.startedTime),
            current: candidateMatches
              .filter((m) => typeof m.goals1 !== "number" && m.startedTime),
            next: candidateMatches
              .filter((m) => typeof m.goals1 !== "number" && !m.startedTime)
          };
          const showOrEmpty = (title, arr = [], T) => {
            return <tbody>
              <tr><td colSpan={4}>{title}</td></tr>
              {arr.length
                ? arr?.map((m, i) => (
                  <T key={`m${i}`} match={m} />
                ))
                : <T match={null} />
              }
            </tbody>
          }
          return (
            <section key={`k${id}`}>
              <table>
                {showOrEmpty("Last played", showMatches.previous, MatchLastPlayed)}
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

function MatchLastPlayed({ match }) {
  if (!match)
    return (
      <tr className="nextArea area-played"><td>No matches finished in group yet.</td></tr>
    );
  const { scheduledTime, team1, team2, goals1, goals2, points1, points2 } =
    match;
  return (
    <tr className="nextArea area-played">
      <td>
        <div>
          <span>{scheduledTime}</span>
          <span>{team1}</span>
          <span>vs</span>
          <span>{team2}</span>
        </div>
        {goals1 && goals2 && (
          <div>
            <span></span>
            <span>
              {goals1}-{points1}
            </span>
            <span></span>
            <span>
              {goals2}-{points2}
            </span>
          </div>
        )}
      </td>
    </tr>
  );
}

function MatchInProgress({ match }) {
  if (!match) return <tr><td className="nextArea area-inprogress">No match in progress.</td></tr>;
  const { scheduledTime, team1, team2 } = match;
  return (
    <tr className="nextArea area-inprogress">
      <td>
        <div>
          <span>{scheduledTime}</span>
          <span>{team1}</span>
          <span>vs</span>
          <span>{team2}</span>
        </div>
      </td>
    </tr>
  );
}

function MatchUpcoming({ match }) {
  if (!match)
    return <div className="nextArea area-nextup">No match in progress.</div>;
  const { scheduledTime, team1, team2, umpiringTeam } = match;
  return (
    <tr className="nextArea area-nextup">
      <td>
        <div>
          <span>{scheduledTime}</span>
          <span>{team1}</span>
          <span>vs</span>
          <span>{team2}</span>
        </div>
      </td>
    </tr>
  );
}
