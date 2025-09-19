import { useState } from "react"; // Removed useEffect as it's not used
import './ScoreSelect.scss';

const Header = ({ name }) => {
  return (
    <div className='header'>
      <span>{name.toUpperCase()}</span>
    </div>
  );
};

const Footer = ({ name, team, pages, setPages, scores, setScores }) => {
  const updateScoreValue = () => {
    const newTeamScores = {
      ...scores[team],
      [name]: null,
    };
    setScores({
      ...scores,
      [team]: newTeamScores,
    });
  };
  
  const increasePage = () => {
    updateScoreValue();
    let end = pages[name] + 1;
    if (end > 4) end = 4;
    setPages({
      ...pages,
      [name]: end,
    });
  };
  
  const decreasePage = () => {
    updateScoreValue();
    let end = pages[name] - 1;
    if (end < 0) end = 0;
    setPages({
      ...pages,
      [name]: end,
    });
  };
  
  return (
    <div className='footer'>
      <button
        className="pi pi-chevron-circle-left navigate"
        disabled={pages[name] < 0 ? "disabled" : ""}
        onClick={decreasePage}
      />
      <button 
        className="pi pi-chevron-circle-right navigate"
        onClick={increasePage}
      />
    </div>
  );
};

const ScoreSelect = ({ scores, setScores, currentTeam, onScoreCompleteForTeam }) => {
  const [pages, setPages] = useState({
    goals: 0,
    points: 0,
  });

  const actions = {
    setScore: (i, team, type) => {
      const newTeamScore = {
        ...scores[team],
        [type]: i,
      };
      const newScores = {
        ...scores,
        [team]: newTeamScore,
      };
      setScores(newScores);

      // Check if both goals and points for the current team are set
      if (newScores[team]?.goals !== null && newScores[team]?.goals !== undefined &&
        newScores[team]?.points !== null && newScores[team]?.points !== undefined) {
        onScoreCompleteForTeam(); // Notify parent to close this picker
      }
    },
  };

  const updateSquares = (team, currentType, totalNumbersPerPage) => {
    let squares = [];
    const from = pages[currentType] * totalNumbersPerPage;
    const to = from + totalNumbersPerPage;
    // Ensure scores[team] exists before trying to access scores[team][currentType]
    const currentScoreValue = scores && scores[team] ? scores[team][currentType] : null;
    for (let i = from; i <= to; i++) { // Changed: iterate from 'from' to 'to' based on pagination
      const cname =
        'square ' +
        (currentScoreValue === i ? 'active' : ""); // Use currentScoreValue
      squares.push(
        <div
          key={i}
          className={cname}
          onClick={() => actions.setScore(i, team, currentType)} // Pass only needed params
        >
          {i}
        </div>
      );
    }
    return squares;
  };

  // The pagination logic in updateSquares needs to use the `pages` state.
  // Assuming goals show 0-9 (10 items) and points 0-19 (20 items) without pagination for now,
  // as the original `updateSquares` was called with max values.
  // If pagination of numbers is intended, `updateSquares` needs to be adjusted.
  // For now, sticking to the simpler interpretation where `totalNumbersPerPage` is the max value.
  const squaresGoals = updateSquares(currentTeam, "goals", 9);
  const squaresPoints = updateSquares(currentTeam, "points", 19);

  return (
    <div className='scoreSelect'>
      <div className="score-column">
        <Header name="goals" />
        <div className='goals'>{squaresGoals}</div>
        <Footer
          name="goals"
          team={currentTeam}
          pages={pages}
          setPages={setPages}
          scores={scores}
          setScores={setScores}
        />
      </div>
      <div />
      <div className="score-column">
        <Header name="points" />
        <div className='points'>{squaresPoints}</div>
        <Footer
          name="points"
          team={currentTeam}
          pages={pages}
          setPages={setPages}
          scores={scores}
          setScores={setScores}
        />
      </div>
    </div>
  );
};

export default ScoreSelect;
