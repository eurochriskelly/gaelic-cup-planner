import { useFixtureStates, useVisibleDrawers } from "./UpdateFixture.hooks";
import StartIcon from "../../../../shared/icons/icon-start.svg?react";
import ScoreIcon from "../../../../shared/icons/icon-score.svg?react";
import ProgressIcon from "../../../../shared/icons/icon-skip.svg?react";
import MoveIcon from "../../../../shared/icons/icon-move.svg?react";
// Child components
import DrawerFinish from "./DrawerFinish";
import DrawerPostpone from "./DrawerPostpone";
import API from "../../../../shared/api/endpoints";
import './UpdateFixture.scss';

export default UpdateFixture;

function UpdateFixture ({
  fixture,
  updateFixtures,
  startMatch,
  moveToNextFixture,
}) {
  // Guard clause: If fixture data is missing, don't render the component
  if (!fixture) {
    console.warn("UpdateFixture rendered without fixture data.");
    return null; // Or return a loading indicator/placeholder
  }

  const { startedTime, isResult } = fixture;
  const [enableStates, setEnableStates] = useFixtureStates(startedTime, isResult);
  const [visibleDrawers, setVisibleDrawers, drawerOpen] = useVisibleDrawers();

  const actions = {
    closeDrawer: () => {
      setVisibleDrawers({
        start: false,
        proceed: false,
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
        finish: false,
      });
    },
    proceed: () => {
      if (enableStates.proceed === "disabled") return;
      moveToNextFixture();
    },
    finish: () => {
      if (enableStates.finish === "disabled") return;
      setVisibleDrawers({
        start: false,
        proceed: false,
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
            <MoveIcon className="icon icon" />
          </button>
          {/* Use SkipIcon button to trigger moving to the next fixture */}
          <button className={`space-button ${enableStates.proceed}`} onClick={actions.proceed}>
            <ProgressIcon className="icon" />
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





