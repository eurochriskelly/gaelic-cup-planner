import { Schema } from "js-yaml"

const getOrdinalSuffix = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

export const formatTeamName = (team) => {
  let displayTeam = team;
  if (team === '~') return '';

  if (team?.startsWith('~')) {
    // e.g. "~match:102/p:1"
    const parts = team?.replace('~', '').split('/');

    const dependent = parts[0];
    const position = +(parts[1].replace('p:', ''));
    const [type, order] = dependent.split(':');

    switch (type) {
      case 'match':
        const outcome = position === 1 ? 'Winner' : 'Loser';
        displayTeam = `${outcome} of FIXTURE #${order}`;
        break;
      case 'semis':
      case 'finals':
      case 'quarters':
        const stageOutcome = position === 1 ? 'Winner' : 'Loser';
        displayTeam = `${stageOutcome} of ${type.toUpperCase()} #${order}`;
        break;
      case 'group':
        // Format: ~group:X/p:Y → "Nth in GP.X"
        if (position >= 1 && position <= 9) {
          const ordinalSuffix = getOrdinalSuffix(position);
          displayTeam = `${position}${ordinalSuffix} in GP.${order}`;
        } else {
          displayTeam = 'T.B.D.';
        }
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
            <span key={index} className="slash text-rose-500 ml-1 mr-1"> / </span>
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