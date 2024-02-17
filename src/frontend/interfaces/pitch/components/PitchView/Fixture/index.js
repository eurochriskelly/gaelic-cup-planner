import React from "react";

import ScoreDisplay from "../../../../../shared/generic/ScoreDisplay";
import ClockIcon from "../../../../../shared/generic/ClockIcon";
import styles from "./Fixture.module.scss";

const Fixture = ({ fixture, isFocus }) => {
  const {
    id,
    startedTime = "",
    scheduledTime = "",
    stage,
    group,
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
    totalTeam1 > totalTeam2 ? team1 : totalTeam1 < totalTeam2 ? team2 : "";
  }

  const scoreUpToDate = !!played;
  const rowClasses = () => {
    const classes = [];
    if (scoreUpToDate) {
      classes.push("scoreUpToDate");
    }
    return classes.join(" ");
  };

  const formatName = (name, winner) => {
    if (name.startsWith("~")) {
      return "T.B.D.";
    }
    return (
      (winner ? "🏅" : "") +
      (" " + name.length > tlen ? name.substring(0, tlen) + "..." : name)
    );
  };

  const categoryLabel = () => {
    return group.replace(/[^A-Z0-9]/g, "");
  };

  return (
    <div
      className={`${styles.fixture} ${isFocus ? styles.focusFixture : ""}`}
      key={id}
    >
      <div
        className={rowClasses()}
        style={{ backgroundColor: scoreUpToDate ? "#bcc6bc" : "" }}
      >
        <div>
          <ClockIcon
            started={startedTime}
            scheduled={scheduledTime}
            focus={isFocus}
            played={scoreUpToDate}
          />
          <span>
            <span>
              <label>STAGE:</label>
              {stage}
            </span>
            <span>{categoryLabel()}</span>
          </span>
        </div>
        <div>
          <div
            className={(winner === team1 ? styles.winner : "") + " teamName"}
          >
            {formatName(team1, winner === team1)}
          </div>
          <ScoreDisplay goals={goals1} points={points1} played={played} />
        </div>
        <div>
          <div
            className={(winner === team2 ? styles.winner : "") + " teamName"}
          >
            {formatName(team2, winner === team2)}
          </div>
          <ScoreDisplay goals={goals2} points={points2} played={played} />
        </div>
        {!played && (
          <div className={styles.umpires}>
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
