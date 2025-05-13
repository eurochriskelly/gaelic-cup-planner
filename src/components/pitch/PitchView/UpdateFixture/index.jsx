import { useMemo, useState, useEffect } from "react";
import StartIcon from "../../../../shared/icons/icon-start.svg?react";
import ScoreIcon from "../../../../shared/icons/icon-score.svg?react";
import ProgressIcon from "../../../../shared/icons/icon-skip.svg?react";
import MoveIcon from "../../../../shared/icons/icon-move.svg?react";
import DialogUpdate from "./DialogUpdate";
import DrawerPostpone from "./DrawerPostpone";
import { useFixtureContext } from "../FixturesContext";
import API from "../../../../shared/api/endpoints";
import './UpdateFixture.scss';

const UpdateFixture = ({
  moveToNextFixture,
  fixture, // optional, depending on the context
}) => {
  const { fetchFixtures, startMatch, fixtures } = useFixtureContext();
  let nextFixture = fixture;
  if (!fixture) nextFixture = useFixtureContext().nextFixture;
  if (!nextFixture) return null;

  const [activeDrawer, setActiveDrawer] = useState(null);

  // Compute button states based on fixture status
  const buttonStates = useMemo(() => {
    console.log("Computing button states...");
    const hasStarted = !!nextFixture.startedTime;
    const hasResult = !!nextFixture.isResult;
    return {
      start: !hasStarted && !hasResult ? "enabled" : "disabled",
      finish: hasStarted ? "enabled" : "disabled",
      postpone: !hasStarted && !hasResult ? "enabled" : "disabled",
      proceed: hasResult ? "enabled" : "disabled",
    };
  }, [nextFixture.startedTime, nextFixture.started, nextFixture.isResult]);

  const actions = {
    closeDrawer: () => {
      setActiveDrawer(null);
      fetchFixtures();
    },
    reschedule: () => {
      if (buttonStates.postpone === "disabled") return;
      setActiveDrawer("postpone");
    },
    start: async () => {
      if (buttonStates.start === "disabled") return;
      try {
        await startMatch(nextFixture.id);
      } catch (error) {
        console.error("Error starting match:", error);
      }
    },
    finish: () => {
      if (buttonStates.finish === "disabled") return;
      setActiveDrawer("finish");
    },
    proceed: async (xx) => {
      if (buttonStates.proceed === "disabled") return;
      moveToNextFixture();
      await API.endMatch(nextFixture.tournamentId, nextFixture.id);
      await fetchFixtures(true);
    },
    rescheduleMatch: async (fixtureId, targetPitch, placement) => {
      await API.rescheduleMatch(nextFixture.tournamentId, targetPitch, nextFixture.id, fixtureId, placement);
      await fetchFixtures();
      setActiveDrawer(null);
    },
  };

  const buttons = [
    { action: actions.reschedule, state: buttonStates.postpone, Icon: MoveIcon },
    { action: actions.start, state: buttonStates.start, Icon: StartIcon },
    { action: actions.finish, state: buttonStates.finish, Icon: ScoreIcon },
    { action: actions.proceed, state: buttonStates.proceed, Icon: ProgressIcon },
  ];

  return (
    <div className="updateFixture select-none" onClick={() => console.log(nextFixture, fixtures)}>
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
            pitch={nextFixture.pitch}
          />
        )}
        {activeDrawer === "finish" && (
          <DialogUpdate
            nextFixture={nextFixture}
            onClose={actions.closeDrawer}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateFixture;