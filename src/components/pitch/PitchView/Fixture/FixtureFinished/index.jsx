import { useState } from 'react';
// Removed extractUppercaseAndNumbers import
import { formatTeamName } from "../../../../../shared/generic/TeamNameDisplay";
import FixtureBar from '../FixtureBar';
import ScoreIcon from "../../../../../shared/icons/icon-score.svg?react";
import '../../../../../components/web/logo-box.js'; // Added logo-box import
import '../../../../../components/web/team-name.js'; // Added team-name import
import DialogUpdate from '../../UpdateFixture/DialogUpdate';
import '../../UpdateFixture/UpdateFixture.scss'; // Import the styles from UpdateFixture
import './FixtureFinished.scss';

export default FixtureFinished;

function FixtureFinished({ 
  fixture,
  onUpdateScore
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    id,
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

 // Removed formatName function

 const gridStyle = {
   backgroundColor: scoreUpToDate ? "#bcc6bc" : "",
   display: 'grid',
    gridTemplateRows: 'auto auto',
  }

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleUpdateScore = (e) => {
    e.stopPropagation();
    setIsDialogOpen(true);
    setIsExpanded(false); // Close the expanded view after clicking
  };

  const handleCloseDialog = async() => {
    if (onUpdateScore) await onUpdateScore(); // Call the original onUpdateScore if provided
    setIsDialogOpen(false);
  };

  return (
    <div 
      className={`FixtureFinished ${isExpanded ? 'expanded' : ''}`} 
      key={id}
      onClick={handleClick}
    >
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

     <div className="fixture-pairing">
       <div className="team-pairing">
         {/* Replaced manual team display with team-name component and score */}
         <div className="team-row-finished">
           <team-name name={team1} show-logo="true" height="40px" direction="l2r"></team-name>
           <div className="team-score">
             {`${goals1 || 0} - ${points1 || 0} (${(goals1 || 0) * 3 + (points1 || 0)})`}
           </div>
         </div>

         <div className="team-row-finished">
           <team-name name={team2} show-logo="true" height="40px" direction="l2r"></team-name>
           <div className="team-score">
             {`${goals2 || 0} - ${points2 || 0} (${(goals2 || 0) * 3 + (points2 || 0)})`}
           </div>
         </div>
       </div>

     </div>

      {isExpanded && (
        <div className="update-actions">
          <button 
            className="update-score-button"
            onClick={handleUpdateScore}
          >
            <ScoreIcon className="icon" />
            Update Score
          </button>
        </div>
      )}

      {isDialogOpen && (
        <>
          <div className="drawer-overlay" onClick={handleCloseDialog} />
          <div className="updateFixture">
            <div className="drawers">
              <DialogUpdate
                nextFixture={fixture}
                onClose={handleCloseDialog}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

