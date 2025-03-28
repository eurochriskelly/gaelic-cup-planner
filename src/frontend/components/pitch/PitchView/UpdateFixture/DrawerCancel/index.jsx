import { useState, useEffect } from "react";
import './DrawerCancel.scss';

const DrawerCancel = ({
  onClose,
  onConfirm,
  visible,
  team1,
  team2
}) => {
  if (!visible) return null;

  const [selectedOption, setSelectedOption] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = (type) => {
    setSelectedOption(type);
    setConfirming(true);
  };

  const handleFinalConfirm = () => {
    onConfirm(selectedOption);
    setSelectedOption(null);
    setConfirming(false);
    onClose();
  };

  const cancelConfirmation = () => {
    setSelectedOption(null);
    setConfirming(false);
  };

  // Reset state when drawer closes
  useEffect(() => {
    if (!visible) {
      setSelectedOption(null);
      setConfirming(false);
    }
  }, [visible]);

  return (
    <div className="drawer drawerCancel">
      <div>
        <div className="drawer-header">Cancel Match</div>
        <div className="drawer-container">
          <div className="cancelForm">
            <div className="drawer-content-row text-center uppercase text-4xl mb-6">
              Select option
            </div>
            {confirming ? (
              <div className="flex flex-col gap-4">
                <div className="text-center text-4xl mb-6">
                  {selectedOption === 'draw' ? (
                    `Click 'YES' to confirm a draw between ${team1} and ${team2}`
                  ) : (
                    `Click 'YES' to confirm Walkover for ${selectedOption === 'team1_forfeit' ? team1 : team2} and Forfeit for ${selectedOption === 'team1_forfeit' ? team2 : team1}`
                  )}
                </div>
                <div className="flex gap-4 bg-gray-500 p-9 text-9xl">
                  <button
                    className="btn btn-primary flex-1 py-4  bg-[#2b7624] hover:bg-[#1f5a1a] text-white mr-1"
                    onClick={handleFinalConfirm}
                  >
                    Yes
                  </button>
                  <button
                    className="btn btn-secondary flex-1 py-4 text-3xl bg-[#885ea3] hover:bg-[#6f4a84] text-white"
                    onClick={cancelConfirmation}
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
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
                    <div className="font-bold text-5xl text-sky-700">captains agree draw</div>
                  </button>
                </div>
              </div>
            )}
          </div>
          {!confirming && (
            <div className="footer mt-6">
              <button 
                className="btn btn-secondary w-full py-4 text-xl"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawerCancel;


function ForfeitButton({
  forfeitTeam,
  walkoverTeam,
  confirmOpt,
  reverse = false,
  onClick
}) {
  const maxTeamNameLen = 16 
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
          <div className={`text-5xl whitespace-nowrap font-bold ${reverse ? 'text-lime-700' : 'text-rose-500'} `}>{reverse ? '🏆 Walkover'  : 'Forfeit'}</div>
        </div>
        <div className="text-right pr-3 pl-3">
          <div className="text-3xl mb-8">
            {(reverse ? walkoverTeam : forfeitTeam).length > maxTeamNameLen
              ? `${(reverse ? walkoverTeam : forfeitTeam).substring(0, maxTeamNameLen)}...`
              : (reverse ? walkoverTeam : forfeitTeam)}
          </div>
          <div className={`text-5xl whitespace-nowrap font-bold ${reverse ? 'text-rose-500' : 'text-lime-700'}`}>{reverse ? 'Forfeit' : 'Walkover 🏆'}</div>
        </div>
      </div>
    </button>
  )
}
