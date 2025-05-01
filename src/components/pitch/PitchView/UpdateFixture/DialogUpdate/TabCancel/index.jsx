import { useState, useEffect } from "react";
import API from "../../../../../../shared/api/endpoints";
import './TabCancel.scss';

const TabCancel = ({ cancellationOption, setCancellationOption, onConfirm, onClose, team1, team2, fixture }) => {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = (type) => {
    setCancellationOption(type);
    setConfirming(true);
  };

  const handleFinalConfirm = () => {
    // Create the result object with the appropriate scores
    const result = {
      scores: {
        team1: { goals: 0, points: 0 },
        team2: { goals: 0, points: 0 }
      },
      outcome: "skipped",
    };
    
    // Set the appropriate scores based on selected option
    if (cancellationOption === 'team1_forfeit') {
      result.scores.team2.points = 1;
    } else if (cancellationOption === 'team2_forfeit') {
      result.scores.team1.points = 1;
    }
    
    // Update score via API
    API.updateScore(fixture.tournamentId, fixture.id, result)
      .then(() => {
        console.log("Match settled without playing:", result);
        setConfirming(false);
      })
      .catch((error) => {
        console.error("Error updating match outcome:", error);
      });
  };

  const cancelConfirmation = () => {
    setCancellationOption(null);
    setConfirming(false);
  };

  useEffect(() => {
    if (!cancellationOption) {
      setConfirming(false);
    }
  }, [cancellationOption]);

  return (
    <div className="drawerCancel">
      <div>
          <div className="cancelForm">
            {confirming ? (
              <div className="flex flex-col gap-4">
                <div className="text-center text-4xl mb-6">
                  {cancellationOption === 'draw' ? (
                    `Click 'YES' to confirm a draw between ${team1} and ${team2}`
                  ) : (
                    <div className="non-played-outcome">
                      <div>Click <b>YES</b> to confirm</div>
                      <div className="p-8">
                        <span className="decision walkover">Walkover</span> 
                        <span>for</span>
                        <span>{cancellationOption === 'team1_forfeit' ? team1 : team2}</span>
                      </div>
                      <div className="color-gray-200 pb-4">and</div>
                      <div className="p-8">
                        <span className="decision forfeit">Forfeit</span>
                        <span>for</span>
                        <span>{cancellationOption === 'team1_forfeit' ? team2 : team1}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 bg-gray-500 p-9 text-9xl">
                  <button
                    className="btn btn-primary flex-1 py-4 text-3xl text-white mr-1"
                    onClick={handleFinalConfirm}
                  >
                    Yes
                  </button>
                  <button
                    className="btn btn-secondary flex-1 py-4 text-3xl text-white"
                    onClick={cancelConfirmation}
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 ">
                <ForfeitButton forfeitTeam={team2} walkoverTeam={team1} confirmOpt={'team1_forfeit'} onClick={handleConfirm} />
                <ForfeitButton forfeitTeam={team1} walkoverTeam={team2} confirmOpt={'team2_forfeit'} reverse={true} onClick={handleConfirm} />
                <div className="bg-gray-200 mb-3 p-7 rounded-1xl">
                  <button
                    className="btn btn-primary w-full py-4 text-xl bg-gray-200 mb-3 p-7 rounded-1xl"
                    onClick={() => handleConfirm('draw')}
                  >
                    <div className="text-3xl mb-8 ">
                      {team1.length > 22 ? `${team1.substring(0, 22)}...` : team1}
                      {' & '}
                      {team2.length > 22 ? `${team2.substring(0, 22)}...` : team2}
                    </div>
                    <div className="font-bold text-5xl text-sky-700">Teams agree draw</div>
                  </button>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

function ForfeitButton({ forfeitTeam, walkoverTeam, confirmOpt, reverse = false, onClick }) {
  const maxTeamNameLen = 16;
  return (
    <button
      className="btn btn-primary w-full py-4 text-xl"
      onClick={() => onClick(confirmOpt)}
    >
      <div className="flex justify-between items-center bg-gray-200 mb-3 p-7 rounded-1xl">
        <div className="text-left pr-3 pl-3">
          <div className="text-3xl mb-8 ">
            {(reverse ? forfeitTeam : walkoverTeam).length > maxTeamNameLen
              ? `${(reverse ? forfeitTeam : walkoverTeam).substring(0, maxTeamNameLen)}...`
              : (reverse ? forfeitTeam : walkoverTeam)}
          </div>
          <div className={`text-5xl whitespace-nowrap font-bold ${reverse ? 'text-lime-700' : 'text-rose-500'} `}>
            {reverse ? '🏆 Walkover' : 'Forfeit'}
          </div>
        </div>
        <div className="text-right pr-3 pl-3">
          <div className="text-3xl mb-8">
            {(reverse ? walkoverTeam : forfeitTeam).length > maxTeamNameLen
              ? `${(reverse ? walkoverTeam : forfeitTeam).substring(0, maxTeamNameLen)}...`
              : (reverse ? walkoverTeam : forfeitTeam)}
          </div>
          <div className={`text-5xl whitespace-nowrap font-bold ${reverse ? 'text-rose-500' : 'text-lime-700'}`}>
            {reverse ? 'Forfeit' : 'Walkover 🏆'}
          </div>
        </div>
      </div>
    </button>
  );
}

export default TabCancel;