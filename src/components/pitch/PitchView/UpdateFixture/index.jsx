import { useMemo, useState, useEffect } from "react";
import StartIcon from "../../../../shared/icons/icon-start.svg?react";
import ScoreIcon from "../../../../shared/icons/icon-score.svg?react";
import ProgressIcon from "../../../../shared/icons/icon-skip.svg?react";
import MoveIcon from "../../../../shared/icons/icon-move.svg?react";
import DialogUpdate from "./DialogUpdate";
import DrawerPostpone from "./DrawerPostpone";
import API from "../../../../shared/api/endpoints";
import './UpdateFixture.scss';

const UpdateFixture = ({ fixture, updateFixtures, startMatch, moveToNextFixture }) => {
  if (!fixture) return null;

  const { startedTime } = fixture;
  // Maintain local state for isResult that can be updated by the drawer
  const [fixtureHasResult, setFixtureHasResult] = useState(fixture.isResult);
  const [activeDrawer, setActiveDrawer] = useState(null);

  // Update local isResult state when fixture prop changes
  useEffect(() => {
    setFixtureHasResult(fixture.isResult);
  }, [fixture.isResult]);

  // Compute button states based on fixture status
  const buttonStates = useMemo(() => {
    const states = {
      start: startedTime || fixtureHasResult ? "disabled" : "enabled",
      finish: startedTime ? "enabled" : "disabled",
      postpone: !startedTime && !fixtureHasResult ? "enabled" : "disabled",
      proceed: fixtureHasResult ? "enabled" : "disabled",
    };
    return states;
  }, [startedTime, fixtureHasResult]);

  const actions = {
    // Updated to handle isResult parameter
    closeDrawer: (isResult) => {
      // Update local result state if provided
      console.log('is result from drawer:', isResult);
      if (isResult) {
        setFixtureHasResult(isResult);
      }
      setActiveDrawer(null);
    },
    start: async () => {
      if (buttonStates.start === "disabled") return;
      await startMatch(fixture.id);
      // No need to update states manually; buttonStates will recompute based on fixture changes
    },
    reschedule: () => {
      if (buttonStates.postpone === "disabled") return;
      setActiveDrawer("postpone");
    },
    proceed: () => {
      if (buttonStates.proceed === "disabled") return;
      moveToNextFixture();
    },
    finish: () => {
      if (buttonStates.finish === "disabled") return;
      setActiveDrawer("finish");
    },
    rescheduleMatch: async (fixtureId, targetPitch, placement) => {
      await API.rescheduleMatch(fixture.tournamentId, targetPitch, fixture.id, fixtureId, placement);
      updateFixtures();
      setActiveDrawer(null);
    },
  };

  const buttons = [
    { action: actions.start, state: buttonStates.start, Icon: StartIcon },
    { action: actions.finish, state: buttonStates.finish, Icon: ScoreIcon },
    { action: actions.reschedule, state: buttonStates.postpone, Icon: MoveIcon },
    { action: actions.proceed, state: buttonStates.proceed, Icon: ProgressIcon },
  ];

  return (
    <div className="updateFixture select-none">
      {activeDrawer && <div className="drawer-overlay" onClick={actions.closeDrawer} />}
      <div
        className="button-grid"
        style={{ display: activeDrawer ? "none" : "grid" }}
      >
        {buttons.map(({ action, state, Icon }, index) => (
          <button
            key={index}
            className={`space-button ${state}`}
            onClick={action}
          >
            <Icon className="icon" />
          </button>
        ))}
      </div>

      <div className="drawers" style={{ display: activeDrawer ? "flex" : "none" }}>
        {activeDrawer === "postpone" && (
          <DrawerPostpone
            onClose={actions.closeDrawer}
            onSubmit={actions.rescheduleMatch}
            pitch={fixture.pitch}
          />
        )}
        {activeDrawer === "finish" && (
          <DialogUpdate
            fixtureId={fixture.id}
            tournamentId={fixture.tournamentId}
            updateFixtures={updateFixtures}
            onClose={actions.closeDrawer}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateFixture;