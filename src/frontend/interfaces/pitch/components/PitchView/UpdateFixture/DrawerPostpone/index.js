import React from "react";

const DrawerPostpone = ({ onClose, delayByOne, delayUntilEnd, visible }) => {
  if (!visible) return null;
  return (
    <div className='DrawerPostpone'>
      <div>
        <div className="drawer-header">Postpone match</div>
        <div className="drawer-container">
          <div className='postponeForm' >
            <div className="drawer-content-row">
              <div className="drawer-content-label">Reason</div>
              <div className="drawer-content-value">
                <input type="text" />
              </div>
            </div>
          </div>
          <div className='footer'>
            <button className="btn btn-primary enabled" onClick={delayByOne}>
              by 1 match
            </button>
            <button className="btn btn-primary enabled" onClick={delayUntilEnd}>
              until end of group
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerPostpone;

