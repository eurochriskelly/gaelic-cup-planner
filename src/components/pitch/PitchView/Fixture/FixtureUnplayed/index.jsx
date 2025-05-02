import { militaryTimeDiffMins } from "../../../../../shared/generic/TeamNameDisplay"; // Removed formatTeamName
import FixtureBar from '../FixtureBar';
import ClockIcon from "../../../../../shared/generic/ClockIcon";
import '../../../../../components/web/gaelic-score.js';
// Removed extractUppercaseAndNumbers import
import '../../../../../components/web/logo-box.js';
import '../../../../../components/web/team-name.js';
import './FixtureUnplayed.scss';

export default FixtureUnplayed;

function FixtureUnplayed({fixture}) {
  const {
    id,
    startedTime = "",
    scheduledTime = "",
    stage,
    category,
    team1,
    goals1,
    points1,
    team2,
    goals2,
    points2,
    played,
    umpireTeam,
  } = fixture;

  const tlen = 24;

  const totalTeam1 = (goals1 || 0) * 3 + (points1 || 0);
  const totalTeam2 = (goals2 || 0) * 3 + (points2 || 0);
  let winner = null;
  if (played) {
    winner = totalTeam1 > totalTeam2 ? team1 : totalTeam1 < totalTeam2 ? team2 : "";
  }

  const scoreUpToDate = !!played;
  const rowClasses = () => {
    const classes = ['grid grid-columns-2 match-area'];
    if (scoreUpToDate) classes.push("scoreUpToDate");
   return classes.join(" ");
 };

 // Removed formatName function

 const gridStyle = {
   backgroundColor: scoreUpToDate ? "#bcc6bc" : "",
   display: 'grid',
    gridTemplateRows: 'auto auto',
  }

  return (
    <div className="FixtureUnplayed" key={id}>
      <FixtureBar 
        fixtureId={id}
        category={category.substring(0, 9).toUpperCase()}
        stage={stage
          .toUpperCase()
          .replace('PLT', 'Plate')
          .replace('CUP', 'Cup')
          .replace('SHD', 'Shield')
          .replace('_', '/')
        }
      />
    
      <div className="unplayed-fixture-data">
        <div className="text-6xl">
          <ClockIcon 
            scheduled={scheduledTime}
            started={startedTime}
            layout={'top'}
            focus={false}
            played={false}
         />
       </div>
       <div className="fixture-pairing">
         <team-name name={team1} show-logo="true" height="40px" direction="l2r"></team-name>
         <team-name name={team2} show-logo="true" height="40px" direction="l2r"></team-name>

         {!played && umpireTeam && (
           <div className="umpires">
             <b>UMPIRING: </b>
             {/* Using team-name for umpire, no logo, smaller height */}
             <team-name name={umpireTeam} show-logo="false" height="20px"></team-name>
           </div>
         )}
       </div>
      </div>
    </div>
  );
}


