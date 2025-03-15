import { useState, useEffect } from "react";
import './DrawerCancel.scss';

const DrawerCancel = ({
  onClose,
  onConfirm,
  visible,
  team1,
  team2
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [confirming, setConfirming] = useState(false);

  if (!visible) return null;

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
    <div className="drawerCancel">
      <div>
        <div className="drawer-header">Cancel Match</div>
        <div className="drawer-container">
          <div className="cancelForm">
            <div className="drawer-content-row text-center uppercase text-4xl mb-6">
              Select option
            </div>
            {confirming ? (
              <div className="flex flex-col gap-4">
                <div className="text-center text-4xl mb-6">Are you sure?</div>
                <div className="flex gap-4">
                  <button
                    className="btn btn-primary flex-1 py-4 text-3xl bg-[#2b7624] hover:bg-[#1f5a1a] text-white"
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
                <button
                  className="btn btn-primary w-full py-4 text-xl"
                  onClick={() => handleConfirm('draw')}
                >
                  <div className="text-3xl mb-8">{team1}{' & '}{team2}</div>
                  <div className="font-bold text-5xl text-sky-700">captains agree draw</div>
                </button>
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
  return (
    <button
      className="btn btn-primary w-full py-4 text-xl"
      onClick={() => onClick(confirmOpt)}
    >
      <div className="flex justify-between items-center">
        <div className="text-left">
          <div className="text-3xl mb-8">{reverse ? forfeitTeam : walkoverTeam}</div>
          <div className={`text-5xl font-bold ${reverse ? 'text-lime-700' : 'text-rose-500'} `}>{reverse ? 'Walkover 🏆' : 'Forfeit'}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl mb-8">{reverse ? walkoverTeam : forfeitTeam}</div>
          <div className={`text-5xl font-bold ${reverse ? 'text-rose-500' : 'text-lime-700'}`}>{reverse ? 'Forfeit' : 'Walkover 🏆'}</div>
        </div>
      </div>
    </button>
  )
}
