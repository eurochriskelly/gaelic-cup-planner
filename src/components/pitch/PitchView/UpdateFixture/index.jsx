import { useState, useEffect, useRef, useCallback } from "react";
import DialogUpdate from "./DialogUpdate";
import DrawerPostpone from "./DrawerPostpone";
import SlideToUnlock from "./SlideToUnlock";
import { useFixtureContext } from "../FixturesContext";
import API from "../../../../shared/api/endpoints";
// icons
import StartIcon from "../../../../shared/icons/icon-start.svg?react";
import ScoreIcon from "../../../../shared/icons/icon-score.svg?react";
import MoveIcon from "../../../../shared/icons/icon-move.svg?react";
import EditIcon from "../../../../shared/icons/icon-edit.svg?react";
import CancelIcon from "../../../../shared/icons/icon-notplayed.svg?react";
import CardIcon from "../../../../shared/icons/icon-card.svg?react";
import ViewIcon from "../../../../shared/icons/icon-details.svg?react";
import CloseIcon from "../../../../shared/icons/icon-close.svg?react";
import OkIcon from "../../../../shared/icons/icon-ok.svg?react";
import ConfirmCancelIcon from "../../../../shared/icons/icon-cancel.svg?react";
import SetLocationIcon from "../../../../shared/icons/icon-setlocation.svg?react";
import EarlierIcon from "../../../../shared/icons/icon-earlier.svg?react";
import LaterIcon from "../../../../shared/icons/icon-later.svg?react";
import './UpdateFixture.scss';

const UpdateFixture = ({
   moveToNextFixture,
   fixture,
   showDetails,
   closeDetails,
   isDetailsMode = false,
   isInlineMoveMode = false,
   inlineMoveTargetPitch = '',
   inlineMoveSummary = '',
   onStartInlineMove,
   onCancelInlineMove,
   onSetInlineMovePitch,
   onMoveInlineEarlier,
   onMoveInlineLater,
   onConfirmInlineMove,
   canConfirmInlineMove = false,
   canSetInlineMovePitch = false,
   canMoveInlineEarlier = false,
   canMoveInlineLater = false,
   canStartInlineMove = false,
   isInlineMoveUnchanged = false,
   isInlineMoveSaving = false,
   variant = 'panel',
 }) => {
  const { fetchFixtures, startMatch } = useFixtureContext();
  let nextFixture = fixture;
  if (!fixture) nextFixture = useFixtureContext().nextFixture;
  if (!nextFixture) return null;

  const [activeDrawer, setActiveDrawer] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isMoveConfirming, setIsMoveConfirming] = useState(false);
  const [railScrollIndex, setRailScrollIndex] = useState(0);

  const hasStarted = !!nextFixture.startedTime;
  const hasResult = !!nextFixture.isResult;
  const isPlannedLane = nextFixture.lane?.current === 'planned';
  const isQueuedLane = nextFixture.lane?.current === 'queued';
  const isPlanned = isPlannedLane || isQueuedLane; // For button visibility logic
  const isFinished = nextFixture.lane?.current === 'finished';
  const needsSlideToUnlock = isPlannedLane || isFinished; // Only planned and finished need slide-to-unlock

  // Timeout refs
  const inactivityTimeoutRef = useRef(null);
  const unlockTimeoutRef = useRef(null);
  const updateFixtureRef = useRef(null);

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
    if (unlockTimeoutRef.current) {
      clearTimeout(unlockTimeoutRef.current);
      unlockTimeoutRef.current = null;
    }
  }, []);

  // Reset lock state
  const lockPanel = useCallback(() => {
    setIsUnlocked(false);
    clearAllTimeouts();
  }, [clearAllTimeouts]);

  // Handle unlock
  const handleUnlock = useCallback(() => {
    setIsUnlocked(true);
    clearAllTimeouts();
    
    // Start 60-second unlock timeout
    unlockTimeoutRef.current = setTimeout(() => {
      lockPanel();
    }, 60000);
  }, [clearAllTimeouts, lockPanel]);

  // Reset inactivity timer on user interaction
  const resetInactivityTimer = useCallback(() => {
    if (!isUnlocked) return; // Only track inactivity when unlocked
    
    clearAllTimeouts();
    
    // Start 10-second inactivity timeout
    inactivityTimeoutRef.current = setTimeout(() => {
      lockPanel();
    }, 10000);
  }, [isUnlocked, clearAllTimeouts, lockPanel]);

  // Reset lock when fixture changes
  useEffect(() => {
    lockPanel();
  }, [fixture?.id, lockPanel]);

  useEffect(() => {
    setIsMoveConfirming(false);
  }, [fixture?.id, isInlineMoveMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Track user activity when unlocked
  useEffect(() => {
    if (!isUnlocked) return;

    const activityEvents = ['mousedown', 'touchstart', 'keydown'];
    
    const handleActivity = () => {
      resetInactivityTimer();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Start initial inactivity timer
    resetInactivityTimer();

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isUnlocked, resetInactivityTimer]);

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
      id: 'edit',
      Icon: EditIcon,
      showOnlyWhenPlanned: true,
      getState: (hasStarted, hasResult) => !hasStarted && !hasResult ? "enabled" : "disabled",
      action: (setDrawer) => {
        showDetails && showDetails('edit');
      }
    },
    {
      id: 'reschedule',
      Icon: MoveIcon,
      showOnlyWhenPlanned: true,
      getState: (hasStarted, hasResult) =>
        !hasStarted && !hasResult && (!onStartInlineMove || canStartInlineMove)
          ? "enabled"
          : "disabled",
      action: (setDrawer) => {
        if (onStartInlineMove) {
          onStartInlineMove();
          return;
        }
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

  const prioritizeButtons = (buttons) => {
    const lane = nextFixture.lane?.current;
    const buttonOrderByLane = {
      planned: ['cancel', 'reschedule', 'edit', 'start', 'cards'],
      queued: ['start', 'cancel', 'reschedule'],
      started: ['finish', 'cards', 'cancel'],
      finished: ['cancel', 'cards']
    };
    const preferredOrder = buttonOrderByLane[lane];

    if (!preferredOrder) {
      return buttons;
    }

    return [...buttons].sort((a, b) => {
      const indexA = preferredOrder.indexOf(a.id);
      const indexB = preferredOrder.indexOf(b.id);
      const fallbackIndexA = indexA === -1 ? preferredOrder.length : indexA;
      const fallbackIndexB = indexB === -1 ? preferredOrder.length : indexB;

      return fallbackIndexA - fallbackIndexB;
    });
  };

  const prioritizedMainButtons = prioritizeButtons(visibleButtons.filter(b => !b.isInfoButton));
  const mainButtons = prioritizedMainButtons.slice(0, 3);
  const infoButton = visibleButtons.find(b => b.isInfoButton);
  const isLocked = !isInlineMoveMode && needsSlideToUnlock && !isUnlocked;
  const isRail = variant === 'rail';
  const railButtonWindowSize = isPlannedLane || isFinished ? 3 : 4;
  const railButtonIdsByLane = {
    planned: [infoButton?.id, 'cancel', 'reschedule', 'edit'].filter(Boolean),
    queued: [infoButton?.id, 'start', 'cancel', 'reschedule'].filter(Boolean),
  };
  const orderedRailButtonIds = railButtonIdsByLane[nextFixture.lane?.current];
  const buttonsById = new Map(visibleButtons.map(button => [button.id, button]));
  const railButtons = orderedRailButtonIds
    ? orderedRailButtonIds.map(id => buttonsById.get(id)).filter(Boolean)
    : [
      ...(infoButton ? [infoButton] : []),
      ...prioritizedMainButtons,
    ];
  const shouldUseRailButtonWindow =
    isRail &&
    !isInlineMoveMode &&
    !isLocked &&
    ((isPlannedLane || isFinished) || railButtons.length > railButtonWindowSize);
  const shouldHideInfoButton = isRail && isLocked;
  const maxRailScrollIndex = Math.max(0, railButtons.length - railButtonWindowSize);

  useEffect(() => {
    setRailScrollIndex(0);
  }, [fixture?.id, nextFixture.lane?.current, isLocked]);

  useEffect(() => {
    setRailScrollIndex((currentIndex) => Math.min(currentIndex, maxRailScrollIndex));
  }, [maxRailScrollIndex]);

  const centerRailCardIfControlsClip = useCallback(() => {
    if (!shouldUseRailButtonWindow || maxRailScrollIndex <= 0 || !updateFixtureRef.current) return;

    const railRoot = updateFixtureRef.current;
    const card = railRoot.closest('.kanban-card');
    const scrollContainer = railRoot.closest('.column-content');
    const scrollControls = Array.from(railRoot.querySelectorAll('.rail-scroll-control'));

    if (!card || !scrollContainer || !scrollControls.length) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const controlsClip = scrollControls.some((control) => {
      const controlRect = control.getBoundingClientRect();
      return controlRect.top < containerRect.top || controlRect.bottom > containerRect.bottom;
    });

    if (!controlsClip || scrollContainer.scrollHeight <= scrollContainer.clientHeight) return;

    let cardOffsetTop = 0;
    let offsetNode = card;

    while (offsetNode && offsetNode !== scrollContainer) {
      cardOffsetTop += offsetNode.offsetTop || 0;
      offsetNode = offsetNode.offsetParent;
    }

    if (offsetNode !== scrollContainer) {
      const cardRect = card.getBoundingClientRect();
      cardOffsetTop = scrollContainer.scrollTop + cardRect.top - containerRect.top;
    }

    const maxScrollTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight);
    const targetScrollTop = Math.max(
      0,
      Math.min(
        maxScrollTop,
        cardOffsetTop - ((scrollContainer.clientHeight - card.offsetHeight) / 2)
      )
    );

    if (Math.abs(scrollContainer.scrollTop - targetScrollTop) < 1) return;

    scrollContainer.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    });
  }, [maxRailScrollIndex, shouldUseRailButtonWindow]);

  useEffect(() => {
    if (!shouldUseRailButtonWindow || maxRailScrollIndex <= 0) return undefined;

    const animationFrameId = window.requestAnimationFrame(centerRailCardIfControlsClip);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [
    centerRailCardIfControlsClip,
    maxRailScrollIndex,
    nextFixture.id,
    railScrollIndex,
    shouldUseRailButtonWindow,
  ]);

  const renderMoveModeButtons = () => {
    if (isMoveConfirming) {
      return (
        <>
          <div className="space-button empty" />
          <button
            className="space-button enabled move-mode-button move-mode-icon-button move-mode-confirm-button"
            onClick={onCancelInlineMove}
            aria-label="Discard move"
          >
            <ConfirmCancelIcon className="icon" />
          </button>
          <div className="space-button empty" />
          <button
            className={`space-button move-mode-button move-mode-icon-button move-mode-confirm-button ${
              canConfirmInlineMove && !isInlineMoveSaving ? 'enabled' : 'disabled'
            }`}
            disabled={!canConfirmInlineMove || isInlineMoveSaving}
            onClick={onConfirmInlineMove}
            aria-label="Confirm move"
          >
            <OkIcon className="icon" />
          </button>
        </>
      );
    }

    return (
      <>
        <button
          className={`space-button move-mode-button move-mode-icon-button move-mode-pitch-button ${
            canMoveInlineEarlier ? 'enabled' : 'disabled'
          }`}
          disabled={!canMoveInlineEarlier}
          onClick={() => {
            setIsMoveConfirming(false);
            onMoveInlineEarlier?.();
          }}
          aria-label="Move fixture earlier"
        >
          <EarlierIcon className="icon" />
        </button>
        <button
          className={`space-button move-mode-button move-mode-icon-button ${
            canSetInlineMovePitch ? 'enabled' : 'disabled'
          }`}
          disabled={!canSetInlineMovePitch}
          onClick={() => {
            setIsMoveConfirming(false);
            onSetInlineMovePitch?.();
          }}
          aria-label={`Move fixture to ${inlineMoveTargetPitch}`}
        >
          <SetLocationIcon className="icon" />
        </button>
        <button
          className={`space-button move-mode-button move-mode-icon-button move-mode-pitch-button ${
            canMoveInlineLater ? 'enabled' : 'disabled'
          }`}
          disabled={!canMoveInlineLater}
          onClick={() => {
            setIsMoveConfirming(false);
            onMoveInlineLater?.();
          }}
          aria-label="Move fixture later"
        >
          <LaterIcon className="icon" />
        </button>
        <button
          className={`space-button move-mode-button move-mode-icon-button move-mode-confirm-button ${
            canConfirmInlineMove && !isInlineMoveSaving ? 'enabled' : 'disabled'
          }`}
          disabled={!canConfirmInlineMove || isInlineMoveSaving}
          onClick={() => {
            if (isInlineMoveUnchanged) {
              onCancelInlineMove?.();
              return;
            }
            setIsMoveConfirming(true);
          }}
          aria-label={isInlineMoveUnchanged ? 'Close move mode' : 'Review move'}
        >
          {isInlineMoveUnchanged ? (
            <CloseIcon className="icon" />
          ) : (
            <OkIcon className="icon" />
          )}
        </button>
      </>
    );
  };

  const renderActionButton = (button) => {
    const state = button.getState(hasStarted, hasResult, nextFixture);
    const isDisabled = state === 'disabled';

    return (
      <button
        key={button.id}
        className={`space-button ${button.isInfoButton ? 'info-button' : ''} ${state}`}
        disabled={isDisabled}
        onClick={() => handleButtonClick(button)}
      >
        <button.Icon className="icon" />
      </button>
    );
  };

  const renderRailButtonScroller = () => {
    const currentRailScrollIndex = Math.min(railScrollIndex, maxRailScrollIndex);
    const visibleRailButtons = railButtons.slice(
      currentRailScrollIndex,
      currentRailScrollIndex + railButtonWindowSize
    );
    const canScrollUp = currentRailScrollIndex > 0;
    const canScrollDown = currentRailScrollIndex < maxRailScrollIndex;
    const scrollRail = (direction) => {
      setRailScrollIndex((currentIndex) => {
        const nextIndex = currentIndex + direction;
        return Math.max(0, Math.min(nextIndex, maxRailScrollIndex));
      });
    };

    return (
      <div
        className={`rail-button-window rail-button-window--${railButtonWindowSize} ${
          canScrollUp ? 'has-scroll-up' : ''
        } ${
          canScrollDown ? 'has-scroll-down' : ''
        }`}
        role="group"
        aria-label="Fixture actions"
      >
        {canScrollUp && (
          <button
            type="button"
            className="rail-scroll-control rail-scroll-control--up"
            onClick={() => scrollRail(-1)}
            aria-label="Show previous fixture actions"
          >
            <span className="rail-scroll-control__triangle" />
          </button>
        )}
        <div className="rail-button-list">
          {visibleRailButtons.map(renderActionButton)}
        </div>
        {canScrollDown && (
          <button
            type="button"
            className="rail-scroll-control rail-scroll-control--down"
            onClick={() => scrollRail(1)}
            aria-label="Show more fixture actions"
          >
            <span className="rail-scroll-control__triangle" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      ref={updateFixtureRef}
      className={`updateFixture select-none updateFixture--${variant} ${
        isInlineMoveMode ? 'has-move-mode' : ''
      }`}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
      draggable="false"
    >
      {isInlineMoveMode && (
        <div className="move-mode-banner">
          <span className="move-mode-banner__title">
            Move on {inlineMoveTargetPitch || nextFixture.pitch}
          </span>
          {inlineMoveSummary && (
            <span className="move-mode-banner__summary">{inlineMoveSummary}</span>
          )}
        </div>
      )}
      <div className={`button-grid ${isInlineMoveMode ? 'move-mode-grid' : ''} ${
        isLocked ? 'is-locked' : ''
      } ${
        shouldUseRailButtonWindow ? 'is-rail-scroll' : ''
      }`}>
        {shouldUseRailButtonWindow ? (
          renderRailButtonScroller()
        ) : (
          <>
            {!isInlineMoveMode && infoButton && !shouldHideInfoButton && (
              <>
                <button
                  className={`space-button info-button ${infoButton.getState()}`}
                  onClick={() => handleButtonClick(infoButton)}
                >
                  <infoButton.Icon className="icon" />
                </button>
                <div className="button-divider" />
              </>
            )}

            {/* Main action buttons on the right */}
            {isLocked ? (
              <div className="slide-to-unlock-container">
                <SlideToUnlock
                  onUnlock={handleUnlock}
                  onLock={lockPanel}
                  isLocked={isLocked}
                  lockedText={isRail ? 'Slide to unlock' : 'Unlock to update'}
                  orientation={isRail ? 'vertical' : 'horizontal'}
                />
              </div>
            ) : (
              // Show main action buttons
              <>
                {isInlineMoveMode
                  ? renderMoveModeButtons()
                  : mainButtons.map(renderActionButton)}

                {/* Generate placeholders only if we have fewer than 3 buttons */}
                {!isInlineMoveMode && !isRail && mainButtons.length < 3 &&
                  [...Array(3 - mainButtons.length)].map((_, i) => (
                    <div key={`empty-${i}`} className="space-button empty" />
                  ))
                }
              </>
            )}
          </>
        )}
      </div>

      <div className="drawers" style={{ display: activeDrawer ? "flex" : "none" }}>
        {activeDrawer === "postpone" && (
          <DrawerPostpone
            onClose={() => setActiveDrawer(null)}
            onSubmit={async (targetFixtureId, targetPitch, placement) => {
              await API.rescheduleMatch(
                nextFixture.tournamentId,
                targetPitch,
                nextFixture.id,
                targetFixtureId,
                placement
              );
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
