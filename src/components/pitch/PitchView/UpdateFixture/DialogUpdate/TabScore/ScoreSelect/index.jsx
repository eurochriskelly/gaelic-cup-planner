import { useState, useEffect } from "react";
import './ScoreSelect.scss';

const Header = ({ name, team, pages, setPages, setLocalScores, localScores }) => {
  const updateScore = () => {
    const newScore = {
      ...localScores,
      [team]: {
        ...localScores[team],
        [name]: null,
      },
    };
    setLocalScores(newScore);
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
        className="pi pi-chevron-circle-left navigate"
        disabled={pages[name] < 0 ? "disabled" : ""}
        onClick={decreasePage}
      />
      <span>{name.toUpperCase()}</span>
      <button 
        className="pi pi-chevron-circle-right navigate"
        onClick={increasePage}
      />
    </div>
  );
};

const ScoreSelect = ({ scores, currentTeam, updateScore }) => {
  const [localScores, setScores] = useState(scores);
  const [pages, setPages] = useState({
    goals: 0,
    points: 0,
  });

  useEffect(() => {
    setScores(scores);
  }, [scores]);

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
      if (newScore[team].goals !== "" && newScore[team].points !== "") {
        updateScore(newScore[team]);
      }
    },
  };

  const updateSquares = (currentTeam, currentType, total) => {
    let squares = [];
    const from = pages[currentType] * total;
    const to = from + total;
    for (let i = from; i <= to; i++) {
      const cname =
        'square ' +
        (localScores[currentTeam][currentType] === i ? 'active' : "");
      squares.push(
        <div
          key={i}
          className={cname}
          onClick={actions.setScore.bind(null, i, currentTeam, currentType, total)}
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
          localScores={localScores}
          setLocalScores={setScores}
        />
        <div className='goals'>{squaresGoals}</div>
      </div>
      <div />
      <div>
        <Header
          name="points"
          team={currentTeam}
          pages={pages}
          setPages={setPages}
          localScores={localScores}
          setLocalScores={setScores}
        />
        <div className='points'>{squaresPoints}</div>
      </div>
    </div>
  );
};

export default ScoreSelect;
