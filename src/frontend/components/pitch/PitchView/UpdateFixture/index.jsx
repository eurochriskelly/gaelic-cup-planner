import { useFixtureStates, useVisibleDrawers } from "./UpdateFixture.hooks";
import StartIcon from "../../../../shared/icons/icon-start.svg?react";
import ScoreIcon from "../../../../shared/icons/icon-score.svg?react";
import MoveIcon from "../../../../shared/icons/icon-move.svg?react";
import NotPlayedIcon from "../../../../shared/icons/icon-notplayed.svg?react";
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
  }

  const drawerStyle = {
    display: drawerOpen ? "flex" : "none",
  };

  return (
    <>
      {drawerOpen && <div className="drawer-overlay" onClick={() => actions.closeDrawer()} />}
      <div className='updateFixture'>
        <div style={{ display: drawerOpen ? "none" : "grid" }} className="button-grid">
          <BtnGetReady btnClass={enableStates.start} onGetReady={actions.start} />
          <BtnUpdateResult btnClass={enableStates.finish} onFinish={actions.finish} />
          <BtnPostpone btnClass={enableStates.postpone} onPostpone={actions.reschedule} />
          <BtnCancel btnClass={enableStates.cancel} onCancel={actions.cancel} />
        </div>

      {/* DRAWERS */}
      <div className='drawers' style={{display: drawerOpen ? 'flex' : 'none'}}>
        {visibleDrawers.postpone && (
          <DrawerPostpone
            visible={true}
            onClose={actions.closeDrawer}
            onSubmit={actions.rescheduleMatch}
            pitch={fixture.pitch}
          />
        )}
        {visibleDrawers.cancel && (
          <DrawerCancel
            visible={true}
            team1={fixture.team1}
            team2={fixture.team2}
            onClose={actions.closeDrawer}
            onConfirm={(type) => {
              console.log('Selected cancellation type:', type);
              actions.closeDrawer();
            }}
          />
        )}
        {visibleDrawers.finish && (
          <DrawerFinish
            visible={true}
            fixture={fixture}
            updateFixtures={updateFixtures}
            onClose={actions.closeDrawer}
          />
        )}
      </div>
    </div>
    </>
  )
};


// Hoist infrequently changed child components
function BtnPostpone({ onPostpone, btnClass }) {
  return (
    <button className={`space-button ${btnClass}`} onClick={onPostpone}>
      <span>Re-schedule</span>
      <MoveIcon className="icon" />
    </button>
  );
}

function BtnCancel({ onCancel, btnClass }) {
  return (
    <button className={`space-button ${btnClass}`} onClick={onCancel}>
      Cancel match
      <NotPlayedIcon className="icon" />
    </button>
  );
}

function BtnGetReady({ onGetReady, btnClass }) {
  return (
    <button className={`space-button ${btnClass}`} onClick={onGetReady}>
      Start tracking
      <StartIcon className="icon" />
    </button>
  );
}

function BtnUpdateResult({ btnClass, onFinish }) {  
  return (
    <button className={`space-button ${btnClass}`} onClick={onFinish}>
      Update result
      <ScoreIcon className="icon" />
    </button>
  );
}

