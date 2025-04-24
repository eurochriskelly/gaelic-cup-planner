import ScoreDisplay from "../../../../../shared/generic/ScoreDisplay";
import { formatTeamName} from "../../../../../shared/generic/TeamNameDisplay";

const TeamResult = ({
  team,
  goals,
  points,
  played,
  winner,
  showScore = true
}) => {
  const isWinner = winner === team
  return (
    <div className='TeamResult'>
      <div className={(isWinner ? 'winner' : 'loser') + " teamName"}>
        <span className='team-icon'>&nbsp;</span>
        <span>{formatTeamName(team, isWinner)}</span>
      </div>
      {showScore && <ScoreDisplay goals={goals} points={points} played={played} />}
    </div>
  )
}

export default TeamResult;
