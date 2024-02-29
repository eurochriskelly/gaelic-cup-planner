import React from "react";
import { getDivisions } from "../../../../../shared/js/styler";

const UpcomingFixtures = ({ groups, styles, nextMatches }) => {
  const liveStyle = {
    gridTemplateColumns: getDivisions(groups.length),
  };
  return (
    <article style={liveStyle}>
      <h2>
        <div>Upcoming</div>
        <div>fixtures</div>
      </h2>
      {groups.slice(0, 3).map((group, id) => {
        return (
          <section key={`k${id}`}>
            <h3>{group}</h3>
            <div>
              {(nextMatches || [])
                .filter((match) => match.category === group)
                .slice(0, 3)
                .map((match, i) => {
                  const {
                    scheduledTime,
                    team1,
                    team2,
                    goals1,
                    goals2,
                    points1,
                    points2,
                    umpiringTeam,
                  } = match;
                  return (
                    <div key={`match${i}`} className={styles.nextArea}>
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
                })}
            </div>
          </section>
        );
      })}
    </article>
  );
};

export default UpcomingFixtures;
