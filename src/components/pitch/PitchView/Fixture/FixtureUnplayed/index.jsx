import { militaryTimeDiffMins } from "../../../../../shared/generic/TeamNameDisplay"; // Removed formatTeamName
import FixtureBar from '../FixtureBar';
import ClockIcon from "../../../../../shared/generic/ClockIcon";
import UmpiresIcon from "../../../../../shared/icons/icon-umpires.svg?react";
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
            size={150}
            layout={'top'}
            focus={false}
            played={false}
         />
       </div>
       <div className="fixture-pairing">
         <team-name name={team1} show-logo="true" height="50px" direction="l2r" width="680px"></team-name>
         <team-name name={team2} show-logo="true" height="50px" direction="l2r"></team-name>

         {!played && umpireTeam && (
           <div className="umpires">
             <span></span>
             <team-name name={umpireTeam} show-logo="true" direction="r2l" height="35px"></team-name>
             <UmpiresIcon width="82" height="82" />
           </div>
         )}
       </div>
      </div>
    </div>
  );
}


