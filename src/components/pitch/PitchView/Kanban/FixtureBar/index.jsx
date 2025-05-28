import { func } from 'prop-types';
import './FixtureBar.scss';

export default function FixtureBar({ 
  fixtureId, 
  category, 
  stage, 
  number, 
  competitionOffset = 1,
  competitionPrefix = '?'
}) {
  const fixtureBarClasses = `FixtureBar ${
    competitionOffset !== undefined && competitionOffset !== null ? `competition-col-${competitionOffset}` : ''
  }`;

  return (
    <div className={fixtureBarClasses.trim()}>
      <div className="fixture-id">
        <svg className="icon-larger" viewBox="0 0 24 24" width="24" height="24">
          <path d="M4 5h16v2H4V5m0 4h16v2H4V9m0 4h16v2H4v-2m0 4h16v2H4v-2z" />
        </svg>
        <span>{category}</span>
        <span className="text-gray-500" style={{color: '#a387ff'}}>/</span>
        <span className="text-gray-200">
          {competitionPrefix}.{`${fixtureId}`.padStart(2, '?').slice(-2)}</span>
      </div>
      <StageDisplay stage={stage} number={number} />
    </div>
  );
}

function StageDisplay({ stage, number }) {
  const parts = stage.split('/');
  const mainStrText = stage === "GROUP"
    ? `Gp.${number}` // We'll handle splitting this in the return
    : parts[0];

  let abbrev = '';
  switch (parts[1]?.toLowerCase()) {
    case '3/4':
    case '3rd4th':
      abbrev = '3/4';
      break;
    case '4/5':
    case '4th5th':
      abbrev = '4/5';
      break;
    case '5/6':
    case '5th6th':
      abbrev = '5/6';
      break;
    case '6/7':
    case '6th7th':
      abbrev = '6/7';
      break;
    case '7/8':
    case '7th8th':
      abbrev = '7/8';
      break;
    case '8/9':
    case '8th9th':
      abbrev = '8/9';
      break;
    case '9/10':
    case '9th10th':
      abbrev = '9/10';
      break;
    case '10/11':
    case '10th11th':
      abbrev = '10/11';
      break;
    case '11/12':
    case '11th12th':
      abbrev = '11/12';
      break;
    case '12/13':
    case '12th13th':
      abbrev = '12/13';
      break;
    case '13/14':
    case '13th14th':
      abbrev = '13/14';
      break;
    case '14/15':
    case '14th15th':
      abbrev = '14/15';
      break;
    case '15/16':
    case '15th16th':
      abbrev = '15/16';
      break;
    case '16/17':
    case '16th17th':
      abbrev = '16/17';
      break;
    case '17/18':
    case '17th18th':
      abbrev = '17/18';
      break;
    case '18/19':
    case '18th19th':
      abbrev = '18/19';
      break;
    case 'eights':
    case 'eight':
      abbrev = 'EF' + number;
      break;
    case 'quarters':
    case 'quarter':
      abbrev = 'QF' + number;
      break;
    case 'semifinals':
    case 'semis':
    case 'semi':
      abbrev = 'SF' + number;
      break;
    case 'finals':
    case 'final':
    case 'fin':
      abbrev = 'FIN';
      break;
    default:
      abbrev = parts[1];
  }

  const stageTypeClass = stage === "GROUP" ? 'group-stage' : 'other-stage';
  let mainStrClass = '';
  const lowerMainStr = mainStrText.toLowerCase(); // Use mainStrText here

  if (stage !== "GROUP") {
    if (lowerMainStr === 'cup') {
      mainStrClass = 'cup-main';
    } else if (lowerMainStr === 'shield') {
      mainStrClass = 'shield-main';
    } else if (lowerMainStr === 'plate') {
      mainStrClass = 'plate-main';
    }
  }

  const stageClassName = `stage text-gray-500 ${stageTypeClass} ${mainStrClass}`.trim();

  let groupNumberClass = '';
  if (stage === "GROUP" && number >= 1 && number <= 5) {
    groupNumberClass = `group-number group-number-${number}`;
  }

  return (
    <div className={stageClassName} onClick={() => { console.log(stage, number) }}>
      <div>
        {stage === "GROUP" ? (
          <>
            <span className={groupNumberClass}>Gp.{number}</span>
          </>
        ) : (
          mainStrText
        )}
      </div>
      {
        stage !== "GROUP" && (
          <div>{abbrev}</div>
        )
      }
    </div>
  )
}
