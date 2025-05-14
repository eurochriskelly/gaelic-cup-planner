import { useMemo, useState, useEffect } from "react";
import StartIcon from "../../../../shared/icons/icon-start.svg?react";
import ScoreIcon from "../../../../shared/icons/icon-score.svg?react";
import ProgressIcon from "../../../../shared/icons/icon-skip.svg?react";
import MoveIcon from "../../../../shared/icons/icon-move.svg?react";
import CancelIcon from "../../../../shared/icons/icon-notplayed.svg?react"; // Import cancel icon
import OkIcon from "../../../../shared/icons/icon-ok.svg?react";
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
    finish: async () => {
      if (buttonStates.finish === "disabled") return;
      setActiveDrawer("finish"); // Same implementation as finish for now
      moveToNextFixture();
      await API.endMatch(nextFixture.tournamentId, nextFixture.id);
      await fetchFixtures(true);
    },
    cancel: () => {
      setActiveDrawer("finish"); // Same implementation as finish for now
    },
    rescheduleMatch: async (fixtureId, targetPitch, placement) => {
      await API.rescheduleMatch(nextFixture.tournamentId, targetPitch, nextFixture.id, fixtureId, placement);
      await fetchFixtures();
      setActiveDrawer(null);
    },
    info: () => {
      console.log("ok clicked");
    },
  };

  // Separate info button from main buttons
  const mainButtons = [
    { action: actions.reschedule, state: buttonStates.postpone, Icon: MoveIcon, showOnlyWhenPlanned: true },
    { action: actions.start, state: buttonStates.start, Icon: StartIcon, showOnlyWhenPlanned: true },
    { action: actions.finish, state: buttonStates.finish, Icon: ScoreIcon, hideWhenPlanned: true },
    { action: actions.cancel, state: "enabled", Icon: CancelIcon },
  ];

  const infoButton = { action: actions.info, state: "enabled", Icon: OkIcon };

  return (
    <div className="updateFixture select-none" onClick={() => console.log(nextFixture, fixtures)}>
      {activeDrawer && <div className="drawer-overlay" onClick={actions.closeDrawer} />}
      <div className="button-grid" style={{ display: activeDrawer ? "none" : "grid" }}>
        {/* Render active buttons first */}
        {mainButtons
          .filter(button =>
            (!button.hideWhenPlanned || nextFixture.lane?.current !== 'planned') &&
            (!button.showOnlyWhenPlanned || nextFixture.lane?.current === 'planned')
          )
          .slice(0, 3)
          .map(({ action, state, Icon }, index) => (
            <button key={index} className={`space-button ${state}`} onClick={action}>
              <Icon className="icon" />
            </button>
          ))}

        {/* Add placeholder divs */}
        {[...Array(3)].map((_, i) => {
          const activeButtonCount = mainButtons.filter(button =>
            (!button.hideWhenPlanned || nextFixture.lane?.current !== 'planned') &&
            (!button.showOnlyWhenPlanned || nextFixture.lane?.current === 'planned')
          ).length;
          return i >= activeButtonCount ? <div key={`placeholder-${i}`} className="space-button empty" /> : null;
        })}

        {/* Always render info button last */}
        <button className={`space-button ${infoButton.state}`} onClick={infoButton.action}>
          <infoButton.Icon className="icon" />
        </button>
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