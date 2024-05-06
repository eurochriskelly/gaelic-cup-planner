import React, { useEffect, useState } from "react";
// Child components
import DrawerFinish from "./DrawerFinish";
import DrawerPostpone from "./DrawerPostpone";
import DrawerGetReady from "./DrawerGetReady";

const UpdateFixture = ({
  fixture,
  updateFixtures,
  startMatch,
  delayByOne,
  delayUntilEnd,
}) => {
  const { startedTime } = fixture;
  const started = !!startedTime;
  const [enableStates, setEnableStates] = useState({
    start: "enabled",
    postpone: "enabled",
    cancel: "enabled",
    finish: "disabled",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closedDrawers = {
    start: false,
    cancel: false,
    postpone: false,
    finish: false,
  };
  const [visibleDrawers, setVisibleDrawers] = useState(closedDrawers);

  useEffect(() => {
    setDrawerOpen(Object.values(visibleDrawers).some((f) => f));
    if (started) {
      setEnableStates({
        start: "disabled",
        postpone: "disabled",
        cancel: "enabled",
        finish: "enabled",
      });
    }
  }, [visibleDrawers, setDrawerOpen, drawerOpen]);
  const actions = {
    closeDrawer: (from) => {
      setEnableStates({
        start: from === "start" ? "disabled" : "enabled",
        postpone: "disabled",
        cancel: "start",
        finish: from === "finish" ? "disabled" : "enabled",
      });
      setVisibleDrawers(closedDrawers);
    },
    start: () => {
      if (enableStates.start === "disabled") return;
      setEnableStates({
        start: "disabled",
        postpone: "disabled",
        cancel: "enabled",
        finish: "enabled",
      });
      setVisibleDrawers({
        ...closedDrawers,
        start: true,
      });
    },
    postpone: () => {
      if (enableStates.postpone === "disabled") return;
      setEnableStates({
        start: "disabled",
        postpone: "disabled",
        cancel: "enabled",
        finish: "disabled",
      });
      setVisibleDrawers({
        start: false,
        postpone: true,
        cancel: false,
        finish: false,
      });
    },
    finish: () => {
      if (enableStates.finish === "disabled") return;
      setEnableStates({
        start: "disabled",
        postpone: "disabled",
        cancel: "disabled",
        finish: "disabled",
      });
      setVisibleDrawers({ ...closedDrawers, finish: true });
    },
    delayByOne: () => {
      console.log("delayByOne");
    },
    delayUntilEnd: () => {
      console.log("delayUntilEnd");
    },
    teamSheetProvided: () => {},
  };
  const drawerStyle = {
    display: drawerOpen ? "flex" : "none",
  };

  return (
    <div className='updateFixture'>
      <div style={{ display: drawerOpen ? "none" : "grid" }}>
        <BtnGetReady btnClass={enableStates.start} onGetReady={actions.start} />
        <BtnUpdateResult btnClass={enableStates.finish} onFinish={actions.finish} />
      </div>
      <div style={{ display: drawerOpen ? "none" : "grid" }}>
        <BtnPostpone btnClass={enableStates.postpone} onPostpone={actions.postpone}/>
        <BtnCancel btnClass={enableStates.cancel} onCancel={actions.cancel} />
      </div>

      {/* DRAWERS */}
      <div className='drawers' style={drawerStyle}>
        <DrawerGetReady
          fixture={fixture}
          startMatch={startMatch}
          teamSheetProvided={actions.teamSheetProvided}
          visible={visibleDrawers.start}
          onClose={actions.closeDrawer}
        />
        <DrawerPostpone
          fixture={fixture}
          delayByOne={actions.delayByOne}
          delayUntilEnd={actions.delayUntilEnd}
          visible={visibleDrawers.postpone}
          onClose={actions.closeDrawer}
        />
        <div
          className="cancel"
          style={{ display: visibleDrawers.cancel ? "block" : "none" }}
        >
          <div className="cancel-time">
            <span>Cancel time</span>
            <span>12:00</span>
          </div>
        </div>
        <DrawerFinish
          fixture={fixture}
          updateFixtures={updateFixtures}
          visible={visibleDrawers.finish}
          onClose={actions.closeDrawer}
        />
      </div>
    </div>
  );
};
export default UpdateFixture;

// Hoist infrequently changed child components
function BtnPostpone({
  onPostpone,
  btnClass
}) {
  return (
    <button className={'space-button enabled'} onClick={onPostpone}>
      <span>Re-schedule</span>
      <span>&nbsp;</span>
      <svg width="22" height="22" viewBox="0 0 20 20">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="white"
          strokeWidth={2}
          fill="none"
        ></circle>
        <path d="M 12,12 L 12,6" stroke="white"></path>
        <path d="M 12,12 L 16,16" stroke="white"></path>
      </svg>
    </button>
  );
}

function BtnCancel({
  onCancel,
  btnClass
}) {
  // class should be btnCancel
  return (
    <button className='disabled' onClick={onCancel}>
      Cancel match&nbsp;
      <svg width="22" height="22" viewBox="0 0 22 22">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="white"
          strokeWidth="3px"
          fill="none"
        ></circle>
        <line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
          stroke="white"
          strokeWidth={2}
        ></line>
      </svg>
    </button>
  );
}

function BtnGetReady({
  onGetReady,
  btnClass
}) {
  return (
      <button
        className={btnClass}
        onClick={onGetReady}
        disabled={!btnClass}
      >
        Get ready &nbsp;
        <svg width="29" height="29" viewBox="0 0 20 20">
          <polygon points="8,5 16,12 8,19" fill="white"></polygon>
        </svg>
      </button>
  )
}

function BtnUpdateResult({
  btnClass,
  onFinish
}) {  
  return (
    <button className={btnClass} onClick={onFinish}>
      Update result&nbsp;
      <svg width="26" height="26" viewBox="0 0 20 20" >
        <rect x="5" y="5" width="14" height="14" fill="white"></rect>
      </svg>
    </button>
  )
}
