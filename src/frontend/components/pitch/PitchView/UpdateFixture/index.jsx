import { useFixtureStates, useVisibleDrawers } from "./UpdateFixture.hooks";
// Child components
import DrawerFinish from "./DrawerFinish";
import DrawerPostpone from "./DrawerPostpone";
import DrawerCancel from "./DrawerCancel";
import API from "../../../../shared/api/pitch";
import './UpdateFixture.scss';

export default UpdateFixture;

function UpdateFixture ({
  fixture,
  updateFixtures,
  startMatch,
}) {
  const { startedTime } = fixture;
  const [enableStates, setEnableStates] = useFixtureStates(startedTime);
  const [visibleDrawers, setVisibleDrawers, drawerOpen] = useVisibleDrawers();

  const actions = {
    closeDrawer: (from) => {
      // Reset only visibility, preserve enableStates unless explicitly changed
      setVisibleDrawers({
        start: false,
        cancel: false,
        postpone: false,
        finish: false,
      });
    },
    start: async () => {
      if (enableStates.start === "disabled") return;
      await startMatch(fixture.id);
      setEnableStates(prev => ({ ...prev, start: "disabled", postpone: "disabled", finish: "enabled" }));
    },
    reschedule: () => {
     if (startedTime || enableStates.postpone === "disabled") return;
      console.log('sss', startedTime)
      setVisibleDrawers({
        start: false,
        postpone: true,
        cancel: false,
        finish: false,
      });
    },
    cancel: () => {
      if (enableStates.cancel === "disabled") return;
      setVisibleDrawers({
        start: false,
        cancel: true,
        postpone: false,
        finish: false,
      });
    },
    finish: () => {
      if (enableStates.finish === "disabled") return;
      setVisibleDrawers({
        start: false,
        cancel: false,
        postpone: false,
        finish: true,
      });
    },
    rescheduleMatch: async (fixtureId, targetPitch, placement) => {
      await API.rescheduleMatch(fixture.tournamentId, targetPitch, fixture.id, fixtureId, placement);
      updateFixtures();
      actions.closeDrawer('postpone');
    },
  };

  const drawerStyle = {
    display: drawerOpen ? "flex" : "none",
  };

  return (
    <div className='updateFixture border-red-400 border-solid'>
      <div style={{ display: drawerOpen ? "none" : "grid" }}>
        <BtnGetReady btnClass={enableStates.start} onGetReady={actions.start} />
        <BtnUpdateResult btnClass={enableStates.finish} onFinish={actions.finish} />
      </div>
      <div style={{ display: drawerOpen ? "none" : "grid" }}>
        <BtnPostpone 
          btnClass={enableStates.postpone === "enabled" ? "enabled primary" : "disabled grey"} 
          onPostpone={actions.reschedule}
        />
        <BtnCancel btnClass={enableStates.cancel} onCancel={actions.cancel} />
      </div>

      {/* DRAWERS */}
      <div className='drawers' style={drawerStyle}>
        <DrawerPostpone
          visible={visibleDrawers.postpone}
          onClose={actions.closeDrawer}
          onSubmit={actions.rescheduleMatch}
          pitch={fixture.pitch}
        />
        <DrawerCancel
          visible={visibleDrawers.cancel}
          team1={fixture.team1}
          team2={fixture.team2}
          onClose={actions.closeDrawer}
          onConfirm={(type) => {
            console.log('Selected cancellation type:', type);
            actions.closeDrawer();
          }}
        />
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


// Hoist infrequently changed child components
function BtnPostpone({
  onPostpone,
  btnClass
}) {
  return (
    <button className={`space-button ${btnClass}`} onClick={onPostpone}>
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
    <button className={`space-button ${btnClass}`} onClick={onCancel}>
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
        disabled={!btnClass}>
        Start tracking&nbsp;
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

