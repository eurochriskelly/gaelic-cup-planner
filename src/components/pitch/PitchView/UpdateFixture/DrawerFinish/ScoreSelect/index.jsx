import { useState, useEffect } from "react"; // Import useEffect
import './ScoreSelect.scss';

// Update Header props to use local state and setter
const Header = ({ name, team, pages, setPages, setLocalScores, localScores }) => {
  const updateScore = () => {
    // Operate on localScores
    const newScore = {
      ...localScores,
      [team]: {
        ...scores[team],
        [name]: null,
      },
    };
    setLocalScores(newScore); // Use the passed setter for local state
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
  console.log("ScoreSelect: Rendering with scores prop:", JSON.stringify(scores)); // DEBUG: Log received prop
  const [localScores, setScores] = useState(scores); // This is the setter for localScores
  const [pages, setPages] = useState({
    goals: 0,
    points: 0,
  });

  // Effect to sync localScores with the scores prop when it changes
  useEffect(() => {
    setScores(scores);
    // Log the value being set, as state update is async
    console.log("ScoreSelect useEffect: Syncing localScores with prop:", JSON.stringify(scores)); // DEBUG
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

  console.log("ScoreSelect: Rendering Header with localScores:", JSON.stringify(localScores)); // DEBUG: Log local state before Header render
  return (
    <div className='scoreSelect'>
      <div>
        <Header
          name="goals"
          team={currentTeam}
          pages={pages}
          setPages={setPages}
          // Pass local state and setter to Header
          localScores={localScores}
          setLocalScores={setScores}
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
          // Pass local state and setter to Header
          localScores={localScores}
          setLocalScores={setScores}
        />
        <div className='points'>{squaresPoints}</div>
      </div>
    </div>
  );
};

export default ScoreSelect;
