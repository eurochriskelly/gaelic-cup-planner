import { useState } from "react";
import DialogUpdate from "./DialogUpdate";
import DrawerPostpone from "./DrawerPostpone";
import { useFixtureContext } from "../FixturesContext";
import API from "../../../../shared/api/endpoints";
// icons
import StartIcon from "../../../../shared/icons/icon-start.svg?react";
import ScoreIcon from "../../../../shared/icons/icon-score.svg?react";
import MoveIcon from "../../../../shared/icons/icon-move.svg?react";
import CancelIcon from "../../../../shared/icons/icon-notplayed.svg?react";
import CardIcon from "../../../../shared/icons/icon-card.svg?react";
import ViewIcon from "../../../../shared/icons/icon-details.svg?react";
import CloseIcon from "../../../../shared/icons/icon-close.svg?react";
import './UpdateFixture.scss';

const UpdateFixture = ({
  moveToNextFixture,
  fixture,
  showDetails,
  closeDetails,
  isDetailsMode = false
}) => {
  const { fetchFixtures, startMatch } = useFixtureContext();
  let nextFixture = fixture;
  if (!fixture) nextFixture = useFixtureContext().nextFixture;
  if (!nextFixture) return null;

  const [activeDrawer, setActiveDrawer] = useState(null);

  const hasStarted = !!nextFixture.startedTime;
  const hasResult = !!nextFixture.isResult;
  const isPlanned = nextFixture.lane?.current === 'planned' || nextFixture.lane?.current === 'queued';

  // Basic buttons definition - won't change
  const buttons = [
    {
      id: 'cancel',
      Icon: CancelIcon,
      getState: () => "enabled",
      action: async (setDrawer) => {
        showDetails && showDetails('forfeit');
        // await fetchFixtures(true);
      }
    },
    {
      id: 'reschedule',
      Icon: MoveIcon,
      showOnlyWhenPlanned: true,
      getState: (hasStarted, hasResult) => !hasStarted && !hasResult ? "enabled" : "disabled",
      action: (setDrawer) => {
        if (showDetails) {
          showDetails('move');
          return;
        }
        setDrawer("postpone");
      }
    },
    {
      id: 'start',
      Icon: StartIcon,
      showOnlyWhenPlanned: true,
      getState: (hasStarted, hasResult, fixture) => {
        const startedNotAllowed = fixture?.lane?.allowedLanes && !fixture.lane.allowedLanes.includes('started');
        const { pitch } = fixture;
        if (isPlanned && startedNotAllowed) {
          return "disabled";
        }
        return !hasStarted && !hasResult ? "enabled" : "disabled";
      },
      action: async (_, { startMatch, nextFixture }) => {
        try {
          await startMatch(nextFixture.id);
          await fetchFixtures(true);
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
      action: async () => { // Removed setDrawer from params as it's not used directly
        showDetails && showDetails('score');
      // The rest of the logic (API calls, fetchFixtures, moveToNextFixture)
      // will be handled by the ScoreEntryWrapper in KanbanDetailsPanel
      }
    },
    {
      id: 'cards', // Renamed from 'forfeit' based on Icon and intended new functionality
      Icon: CardIcon,
      getState: () => "enabled",
      action: () => { // Removed setDrawer
        // closeDetails && closeDetails(); // Panel will manage its own visibility
        showDetails && showDetails('cards'); // Show details panel in 'cards' mode
      // setDrawer("finish") // No longer managing drawer here
      }
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
        action: () => showDetails && showDetails('info'),
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
      <div className="button-grid">
        {mainButtons.map((button) => {
          const state = button.getState(hasStarted, hasResult, nextFixture);
          const isDisabled = state === 'disabled';

          return (
            <button
              key={button.id}
              className={`space-button ${state}`}
              disabled={isDisabled}
              onClick={() => handleButtonClick(button)}
            >
              <button.Icon className="icon" />
            </button>
          );
        })}

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
            visible={activeDrawer === "postpone"}
          />
        )}
        {activeDrawer === "finish" && (
          <DialogUpdate
            nextFixture={nextFixture}
            startMatch={startMatch}
            onClose={async () => {
              await fetchFixtures();
              setActiveDrawer(null)
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateFixture;
