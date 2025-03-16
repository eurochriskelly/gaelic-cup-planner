import { Schema } from "js-yaml"

export const formatTeamName = (team) => {
  let displayTeam = team;
  if (team === '~') return '';

  if (team?.startsWith('~')) {
    // e.g. "~match:102/p:1"
    const parts = team?.replace('~', '').split('/');

    const dependent = parts[0];
    const position = +(parts[1].replace('p:', ''));
    const [type, order] = dependent.split(':');
    const outcome = order === 1 ? 'Winner' : 'Loser';

    switch (type) {
      case 'match':
        displayTeam = `${outcome} of FIXTURE #${position}`;
        break;
      case 'semis':
      case 'finals':
      case 'quarters':
        displayTeam = `${outcome} of ${type.toUpperCase()} #${position}`;
        break;
      default:
        displayTeam = 'T.B.D.';
        break;
    }
  }

  return formatWithSpans(displayTeam.toUpperCase());
};

const formatWithSpans = (text) => {
  if (text === 'T.B.D.') {
    return <span className="text-rose-500">T.B.D.</span>;
  }

  if (text.includes('/')) {
    return (
      <span>
        {text.split(/(\/)/).map((part, index) =>
          part === '/' ? (
            <span key={index} className="slash text-rose-500 ml-2 mr-2"> / </span>
          ) : (
            <span key={index} className="whitespace-nowrap">{part}</span>
          )
        )}
      </span>
    );
  }

  return <span>{text}</span>;
};


export const militaryTimeDiffMins = (startTime, endTime) => {
  if (startTime && endTime) {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    return endTotalMinutes - startTotalMinutes;
  } else {
    return null 
  }
}

function TeamNameDisplay({
  team,
  number
}) {
  let displayTeam = formatTeamName(team)
  return <div className={`team${number}`}>{displayTeam}</div>
}

export default TeamNameDisplay
