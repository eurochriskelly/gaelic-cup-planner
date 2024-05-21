import React from "react";
import { getDivisions } from "../../../../../shared/js/styler";

import "./UpcomingFixtures.css";


const UpcomingFixtures = ({
  groups, 
  nextMatches
}) => {
  const liveStyle = { gridTemplateColumns: getDivisions(groups.length) };
  // We show a maximum of 3 groups
  const nextGroups = groups.slice(0, 3);
  return (
    <article style={liveStyle} className="upcomingFixtures">
      <h2>
        <div>Upcoming fixtures</div>
      </h2>
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
              return <>
                <h4>{title}</h4>
                { arr.length
                  ? arr?.map((m, i) => (
                      <T key={`m${i}`} match={m} />
                    ))
                  : <T match={null} />
                }
              </>
          }
          return (
            <section key={`k${id}`}>
              { showOrEmpty("Last played", showMatches.previous, MatchLastPlayed) }
              { showOrEmpty("In progress", showMatches.current, MatchInProgress) }
              { showOrEmpty("Next up", showMatches.next, MatchUpcoming) }
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
      <div className="nextArea area-played">No matches finished in group yet.</div>
    );
  const { scheduledTime, team1, team2, goals1, goals2, points1, points2 } =
    match;
  return (
    <div className="nextArea area-played">
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
    </div>
  );
}

function MatchInProgress({ match }) {
  if (!match) return <div className="nextArea area-inprogress">No match in progress.</div>;
  const { scheduledTime, team1, team2 } = match;
  return (
    <div className="nextArea area-inprogress">
      <div>
        <span>{scheduledTime}</span>
        <span>{team1}</span>
        <span>vs</span>
        <span>{team2}</span>
      </div>
    </div>
  );
}

function MatchUpcoming({ match }) {
  if (!match)
    return <div className="nextArea area-nextup">No match in progress.</div>;
  const { scheduledTime, team1, team2, umpiringTeam } = match;
  return (
    <div className="nextArea area-nextup">
      <div>
        <span>{scheduledTime}</span>
        <span>{team1}</span>
        <span>vs</span>
        <span>{team2}</span>
      </div>
    </div>
  );
}
