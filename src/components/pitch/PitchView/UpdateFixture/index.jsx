import { useState } from "react";
import StartIcon from "../../../../shared/icons/icon-start.svg?react";
import ScoreIcon from "../../../../shared/icons/icon-score.svg?react";
import MoveIcon from "../../../../shared/icons/icon-move.svg?react";
import CancelIcon from "../../../../shared/icons/icon-notplayed.svg?react";
import CardIcon from "../../../../shared/icons/icon-card.svg?react";
import ViewIcon from "../../../../shared/icons/icon-details.svg?react";
import CloseIcon from "../../../../shared/icons/icon-close.svg?react";
import DialogUpdate from "./DialogUpdate";
import DrawerPostpone from "./DrawerPostpone";
import { useFixtureContext } from "../FixturesContext";
import API from "../../../../shared/api/endpoints";
import './UpdateFixture.scss';

const UpdateFixture = ({
  moveToNextFixture,
  fixture,
  showDetails,
  closeDetails,
  isDetailsMode = false
}) => {
  const { fetchFixtures, startMatch, fixtures } = useFixtureContext();
  let nextFixture = fixture;
  if (!fixture) nextFixture = useFixtureContext().nextFixture;
  if (!nextFixture) return null;

  const [activeDrawer, setActiveDrawer] = useState(null);

  const hasStarted = !!nextFixture.startedTime;
  const hasResult = !!nextFixture.isResult;
  const isPlanned = nextFixture.lane?.current === 'planned';

  // Basic buttons definition - won't change
  const buttons = [
    {
      id: 'cancel',
      Icon: CancelIcon,
      getState: () => "enabled",
      action: (setDrawer) => setDrawer("finish")
    },
    {
      id: 'reschedule',
      Icon: MoveIcon,
      showOnlyWhenPlanned: true,
      getState: (hasStarted, hasResult) => !hasStarted && !hasResult ? "enabled" : "disabled",
      action: (setDrawer) => setDrawer("postpone")
    },
    {
      id: 'start',
      Icon: StartIcon,
      showOnlyWhenPlanned: true,
      getState: (hasStarted, hasResult) => !hasStarted && !hasResult ? "enabled" : "disabled",
      action: async (_, { startMatch, nextFixture }) => {
        try {
          await startMatch(nextFixture.id);
        } catch (error) {
          console.error("Error starting match:", error);
        }
      }
    },
    {
      id: 'finish',
      Icon: ScoreIcon,
      hideWhenPlanned: true,
      getState: (hasStarted) => hasStarted ? "enabled" : "disabled",
      action: async (setDrawer) => {
        console.log('Setting finish drawer');
        setDrawer("finish");
        console.log('Finish drawer set aa');
        moveToNextFixture();
        console.log('Moving to next fixture');
        await API.endMatch(nextFixture.tournamentId, nextFixture.id);
        console.log('Match ended');
        await fetchFixtures(true);
        console.log('Fixtures fetched');
      }
    },
    {
      id: 'forfeit',
      Icon: CardIcon,
      getState: () => "enabled",
      action: (setDrawer) => setDrawer("finish")
    },
    // The last button changes based on mode
    ...(isDetailsMode ? [
      {
        id: 'close',
        Icon: CloseIcon,
        getState: () => "enabled",
        action: () => closeDetails && closeDetails(),
        isInfoButton: true
      }
    ] : [
      {
        id: 'info',
        Icon: ViewIcon,
        getState: () => "enabled",
        action: () => showDetails && showDetails(),
        isInfoButton: true
      }
    ])
  ];

  const handleButtonClick = (button) => {
    const deps = { startMatch, nextFixture, moveToNextFixture, API, fetchFixtures };
    button.action(setActiveDrawer, deps);
  };

  const getVisibleButtons = () => {
    return buttons.filter(button => {
      if (button.isInfoButton) return true;
      if (button.hideWhenPlanned && isPlanned) return false;
      if (button.showOnlyWhenPlanned && !isPlanned) return false;
      return true;
    });
  };

  const visibleButtons = getVisibleButtons();
  const mainButtons = visibleButtons.filter(b => !b.isInfoButton).slice(0, 3); // Limit to max 3 buttons
  const infoButton = visibleButtons.find(b => b.isInfoButton);

  return (
    <div className="updateFixture select-none">
      {activeDrawer && <div className="drawer-overlay" onClick={() => setActiveDrawer(null)} />}
      <div className="button-grid" style={{ display: activeDrawer ? "none" : "grid" }}>
        {mainButtons.map((button, index) => (
          <button
            key={button.id}
            className={`space-button ${button.getState(hasStarted, hasResult)}`}
            onClick={() => (console.log('click on button ', button.id)) || handleButtonClick(button)}
          >
            <button.Icon className="icon" />
          </button>
        ))}

        {/* Generate placeholders only if we have fewer than 3 buttons */}
        {mainButtons.length < 3 &&
          [...Array(3 - mainButtons.length)].map((_, i) => (
            <div key={`empty-${i}`} className="space-button empty" />
          ))
        }

        {infoButton && (
          <button
            className={`space-button info-button ${infoButton.getState()}`}
            onClick={() => handleButtonClick(infoButton)}
          >
            <infoButton.Icon className="icon" />
          </button>
        )}
      </div>

      <div className="drawers" style={{ display: activeDrawer ? "flex" : "none" }}>
        {activeDrawer === "postpone" && (
          <DrawerPostpone
            onClose={() => setActiveDrawer(null)}
            onSubmit={async (fixtureId, targetPitch, placement) => {
              await API.rescheduleMatch(nextFixture.tournamentId, targetPitch, nextFixture.id, fixtureId, placement);
              await fetchFixtures();
              setActiveDrawer(null);
            }}
            pitch={nextFixture.pitch}
          />
        )}
        {activeDrawer === "finish" && (
          <DialogUpdate
            nextFixture={nextFixture}
            onClose={() => setActiveDrawer(null)}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateFixture;