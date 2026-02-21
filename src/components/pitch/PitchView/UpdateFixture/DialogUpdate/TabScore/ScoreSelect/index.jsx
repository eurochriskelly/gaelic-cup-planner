import { useState } from "react";
import './ScoreSelect.scss';

const Header = ({ name }) => {
  return (
    <div className='header'>
      <span>{name.toUpperCase()}</span>
    </div>
  );
};

const Footer = ({ name, fieldName, team, pages, setPages, scores, setScores }) => {
  const updateScoreValue = () => {
    const newTeamScores = {
      ...scores[team],
      [fieldName]: null,
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

const ScoreSelect = ({ scores, setScores, currentTeam, goalField = 'goals', pointField = 'points', onScoreCompleteForTeam }) => {
  const [pages, setPages] = useState({
    goals: 0,
    points: 0,
  });

  const actions = {
    setScore: (i, team, fieldName) => {
      const newTeamScore = {
        ...scores[team],
        [fieldName]: i,
      };
      const newScores = {
        ...scores,
        [team]: newTeamScore,
      };
      setScores(newScores);

      // Check if both goals and points for the current team are set
      if (newScores[team]?.[goalField] !== null && newScores[team]?.[goalField] !== undefined &&
        newScores[team]?.[pointField] !== null && newScores[team]?.[pointField] !== undefined) {
        onScoreCompleteForTeam(); // Notify parent to close this picker
      }
    },
  };

  const updateSquares = (team, fieldName, displayName, totalNumbersPerPage) => {
    let squares = [];
    const from = pages[displayName] * totalNumbersPerPage;
    const to = from + totalNumbersPerPage;
    // Ensure scores[team] exists before trying to access scores[team][fieldName]
    const currentScoreValue = scores && scores[team] ? scores[team][fieldName] : null;
    for (let i = from; i <= to; i++) {
      const cname =
        'square ' +
        (currentScoreValue === i ? 'active' : "");
      squares.push(
        <div
          key={i}
          className={cname}
          onClick={() => actions.setScore(i, team, fieldName)}
        >
          {i}
        </div>
      );
    }
    return squares;
  };

  const squaresGoals = updateSquares(currentTeam, goalField, "goals", 9);
  const squaresPoints = updateSquares(currentTeam, pointField, "points", 19);

  return (
    <div className='scoreSelect'>
      <div className="score-column">
        <Header name="goals" />
        <div className='goals'>{squaresGoals}</div>
        <Footer
          name="goals"
          fieldName={goalField}
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
          fieldName={pointField}
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
