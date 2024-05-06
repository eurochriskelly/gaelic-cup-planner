import React from "react";

const ScoreDisplay = ({ header, goals, points, played }) => {
  if (header) return <span>Score</span>;
  let haveGoals = true;
  let havePoints = true;
  if (goals === "" || goals === null || goals === undefined) {
    haveGoals = false;
  }

  if (points === "" || points === null || points === undefined) {
    havePoints = false;
  }
  const style = {
    backgroundColor: "#efefef",
    border: "0.2rem dotted #ddd",
    borderRadius: "0.2rem",
    padding: "0.8rem 0.5rem",
    fontSize: "0.7em",
    minWidth: "100px",
    margin: "0.8rem 2rem",
    userSelect: "none",
  };
  if (!havePoints && !haveGoals) {
    return (
      <span style={style}>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </span>
    );
  }
  const ifPlayed = (val) => (played ? `00${val}`.slice(-2) : "??");
  const ifPlayedGoals = (val) => (played ? val : "?");
  return (
    <span
      style={{
        fontSize: "2.6rem",
        textAlign: "center",
        padding: "9px 0",
        userSelect: "none",
        backgroundColor: "rgba(179,198,179,0.5)",
      }}
    >
      {ifPlayedGoals(goals || "0")}-{ifPlayed(points || "0")}{" "}
      <span style={{ color: "#888" }}>
        (
          <span style={{ fontWeight: "bold", color: "#000" }}>
            {ifPlayed((goals || 0) * 3 + (points || 0))}
          </span>
        )
      </span>
    </span>
  );
};

export default ScoreDisplay;
