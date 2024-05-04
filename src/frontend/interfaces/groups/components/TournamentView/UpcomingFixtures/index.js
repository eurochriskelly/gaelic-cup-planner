import React from "react";
import { getDivisions } from "../../../../../shared/js/styler";

const blockStyle = (col = "green") => ({
  border: `3px solid ${col}`,
  height: "100px",
  margin: '0.4rem'
});

const UpcomingFixtures = ({ groups, nextMatches }) => {
  const liveStyle = {
    gridTemplateColumns: getDivisions(groups.length),
  };
  // We show a maximum of 3 groups
  const nextGroups = groups.slice(0, 3);
  return (
    <article style={liveStyle}>
      <h2>
        <div>Upcoming fixtures</div>
      </h2>
      {nextGroups.map((group, id) => {
        const candidateMatches = (nextMatches || [])
          .filter((match) => match.category === group)
          .slice(0, 3);

        const showMatches = {
          previous: candidateMatches
            .filter((m) => typeof m.goals1 === "number" && m.startedTime)
            .shift(),
          current: candidateMatches
            .filter((m) => typeof m.goals1 !== "number" && m.startedTime)
            .shift(),
          next: candidateMatches
            .filter((m) => typeof m.goals1 !== "number" && !m.startedTime)
            .shift(),
        };
        return (
          <section key={`k${id}`}>
            <h3>{group}</h3>
            <MatchLastPlayed match={showMatches.previous} />
            <MatchInProgress match={showMatches.current} />
            <MatchUpcoming match={showMatches.next}  />
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
      <div style={blockStyle('green')}>No matches finished in group yet.</div>
    );
  const { scheduledTime, team1, team2, goals1, goals2, points1, points2 } =
    match;
  return (
    <div className='nextArea' style={blockStyle("green")}>
      <h4>Last played</h4>
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
  if (!match) return <div style={blockStyle('red')} >No match in progress.</div>;
  const { scheduledTime, team1, team2 } = match;
  return (
    <div className='nextArea' style={blockStyle("red")}>
      <h4>In progress</h4>
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
  if (!match) return <div style={blockStyle('blue')}>No match in progress.</div>;
  const { scheduledTime, team1, team2, umpiringTeam } = match;
  return (
    <div className='nextArea' style={blockStyle("blue")}>
      <h4>Next up</h4>
      <div>
        <span>{scheduledTime}</span>
        <span>{team1}</span>
        <span>vs</span>
        <span>{team2}</span>
      </div>
    </div>
  );
}
