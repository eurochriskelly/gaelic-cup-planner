export const formatTeamName = (team) => {
  let displayTeam = team
  if (team.startsWith('~')) {
    // e.g. "~match:102/p:1"
    const parts = team.replace('~', '').split('/')
    const dependent = parts[0]
    const position = +(parts[1].replace('p:', ''))
    const [ type, order ] = dependent.split(':')
    const outcome = order === 1 ? 'Winner' : 'Loser'
    switch (type) {
      case 'match':
        displayTeam = `${outcome} of FIXTURE #${position}`
        break
      case 'semis':
      case 'finals':
      case 'quarters':
        displayTeam = `${outcome} of ${type.toUpperCase()} #${position}`
        break
      default: 
        displayTeam =  'T.B.D.'
        break
    }
  }
  return displayTeam;
}

function TeamNameDisplay({
  team,
  number
}) {
  let displayTeam = formatTeamName(team)
  return <div className={`team${number}`}>{displayTeam}</div>
}

export default TeamNameDisplay
