import React, { useEffect, useState } from 'react';
import styles from './ScoreSelect.module.scss';

const ScoreSelect = ({ scores, currentTeam, updateScore }) => {
    const [localScores, setScores] = useState(scores);

    let squaresGoals = [];
    let squaresPoints = [];

    console.log(currentTeam)

    const updateSquares = (currentTeam, currentType, total) => {
        let squares = []; 
        for (let i = 0; i <= total; i++) {
            const cname = styles.square + (localScores[currentTeam][currentType] === i ? ` ${styles.active}` : '')
            squares.push(
                <div key={i} className={cname} onClick={() => {
                    const newScore = {
                        ...localScores,
                        [currentTeam]: {
                            ...localScores[currentTeam],
                            [currentType]: i
                        }
                    };
                    setScores(newScore);
                    if (newScore[currentTeam].goals === '' || newScore[currentTeam].points === '') return;
                    updateScore(newScore[currentTeam]); // callback when both values have been selected
                }}>
                    {(i % total === 0 && i !== 0) ? '...' : i}
                </div>
            );
        }
        return squares;
    };
    
    squaresGoals = updateSquares(currentTeam, 'goals', 9);
    squaresPoints = updateSquares(currentTeam, 'points', 19);

    return (
        <div className={styles.scoreSelect}>
            <div className={styles.goals}>{squaresGoals}</div>
            <div>-</div>
            <div className={styles.points}>{squaresPoints}</div>
        </div>
    );
};

export default ScoreSelect;
