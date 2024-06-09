import { useState } from "react";
import './ScoreSelect.scss';

const Header = ({ name, team, pages, setPages, setScores, scores }) => {
  const updateScore = () => {
    const newScore = {
      ...scores,
      [team]: {
        ...scores[team],
        [name]: null,
      },
    };
    setScores(newScore);
  };
  const increasePage = () => {
    updateScore();
    let end = pages[name] + 1;
    if (end > 4) end = 4;
    setPages({
      ...pages,
      [name]: end,
    });
  };
  const decreasePage = () => {
    updateScore();
    let end = pages[name] - 1;
    if (end < 0) end = 0;
    setPages({
      ...pages,
      [name]: end,
    });
  };
  return (
    <div className='header'>
      <button
        disabled={pages[name] < 0 ? "disabled" : ""}
        onClick={decreasePage}
      >
        &larr;
      </button>
      <span>{name.toUpperCase()}</span>
      <button onClick={increasePage}>&rarr;</button>
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
        'square ' +
        (localScores[currentTeam][currentType] === i
          ? 'active'
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
    <div className='scoreSelect'>
      <div>
        <Header
          name="goals"
          team={currentTeam}
          pages={pages}
          setPages={setPages}
          scores={scores}
          setScores={setScores}
        />
        <div className='goals'>{squaresGoals}</div>
      </div>
      <div/>
      <div>
        <Header
          name="points"
          team={currentTeam}
          pages={pages}
          setPages={setPages}
          scores={scores}
          setScores={setScores}
        />
        <div className='points'>{squaresPoints}</div>
      </div>
    </div>
  );
};

export default ScoreSelect;
