import React, { useState } from "react";
import styles from "./ScoreSelect.module.scss";

const Header = ({ name, pages, setPages }) => {
  const increasePage = () => {
    console.log('Increasing page')
    setPages({
      ...pages,
      [name]: pages[name] + 1,
    });
  };
  const decreasePage = () => {
    setPages({
      ...pages,
      [name]: pages[name] - 1,
    });
  };
  return (
    <div className={styles.header}>
      <span onClick={decreasePage}>&larr;</span>
      <span>{name.toUpperCase()}</span>
      <span onClick={increasePage}>&rarr;</span>
    </div>
  );
};

const ScoreSelect = ({ scores, currentTeam, updateScore }) => {
  const [localScores, setScores] = useState(scores);
  const [pages, setPages] = useState({
    goals: 0,
    points: 0,
  });
  let squaresGoals = [];
  let squaresPoints = [];

  const actions = {
    setScore: (i, team, type, total) => {
      console.log("i is ", i, "type is ", type, "team is ", team);
      const newScore = {
        ...localScores,
        [team]: {
          ...localScores[team],
          [type]: i,
        },
      };
      setScores(newScore);
      if (newScore[team].goals === "" || newScore[team].points === "") return;
      updateScore(newScore[team]); // callback when both values have been selected
    },
  };

  // Update the values in each of the squares
  const updateSquares = (currentTeam, currentType, total) => {
    let squares = [];
    const from = pages[currentType] * total;
    const to = from + total;
    for (let i = from; i <= to; i++) {
      const cname =
        styles.square +
        (localScores[currentTeam][currentType] === i
          ? ` ${styles.active}`
          : "");
      squares.push(
        <div
          key={i}
          className={cname}
          onClick={actions.setScore.bind(
            null,
            i,
            currentTeam,
            currentType,
            total
          )}
        >
          {i}
        </div>
      );
    }
    return squares;
  };

  squaresGoals = updateSquares(currentTeam, "goals", 9);
  squaresPoints = updateSquares(currentTeam, "points", 19);

  return (
    <div className={styles.scoreSelect}>
      <div>
        <Header name="goals" pages={pages} setPages={setPages}/>
        <div className={styles.goals}>{squaresGoals}</div>
      </div>
      <div>-</div>
      <div>
        <Header name="points" pages={pages} setPages={setPages} />
        <div className={styles.points}>{squaresPoints}</div>
      </div>
    </div>
  );
};

export default ScoreSelect;
