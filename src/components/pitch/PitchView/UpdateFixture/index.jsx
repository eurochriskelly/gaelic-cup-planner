import { useFixtureStates, useVisibleDrawers } from "./UpdateFixture.hooks";
import StartIcon from "../../../../shared/icons/icon-start.svg?react";
import ScoreIcon from "../../../../shared/icons/icon-score.svg?react";
import SkipIcon from "../../../../shared/icons/icon-skip.svg?react";
import CardIcon from "../../../../shared/icons/icon-card.svg?react";
import NotPlayedIcon from "../../../../shared/icons/icon-notplayed.svg?react";
// Child components
import DrawerFinish from "./DrawerFinish";
import DrawerPostpone from "./DrawerPostpone";
import DrawerCancel from "./DrawerCancel";
import API from "../../../../shared/api/endpoints";
import './UpdateFixture.scss';

export default UpdateFixture;

function UpdateFixture ({
  fixture,
  updateFixtures,
  startMatch,
  isFinished = false,
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
      <div className='updateFixture select-none'>
        <div style={{ display: drawerOpen ? "none" : "grid" }} className="button-grid">
          <button className={`space-button ${enableStates.start}`} onClick={actions.start}>
            <StartIcon className="icon" />
          </button>
          <button className={`space-button ${enableStates.finish}`} onClick={actions.finish}>
            <ScoreIcon className="icon" />
          </button>
          <button className={`space-button ${enableStates.postpone}`} onClick={actions.reschedule}>
            <CardIcon className="icon icon" />
          </button>
          <button className={`space-button ${enableStates.cancel}`} onClick={actions.cancel}>
            <SkipIcon className="icon" />
          </button>
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
        
        {isFinished && !visibleDrawers.finish && (
          <FixtureFinished 
            fixture={fixture}
            onUpdateScore={actions.finish}
          />
        )}
      </div>
    </div>
    </>
  )
};





