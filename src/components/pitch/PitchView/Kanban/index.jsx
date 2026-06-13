import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useFixtureContext } from '../FixturesContext';
import { useAppContext } from '../../../../shared/js/Provider';
import { choosePreferredPitch, normalizePitchId } from '../../../../shared/js/pitchSelection';
import { useStartMatch } from '../PitchView.hooks';
import { useKanbanBoard } from './useKanbanBoard';
import KanbanColumn from './KanbanColumn';
import KanbanFilters from './KanbanFilters';
import KanbanDetailsPanel from './KanbanDetailsPanel';
import KanbanErrorMessage from './KanbanErrorMessage';
import PitchSelector from './PitchSelector'; // Import PitchSelector
import UpdateFixture from '../UpdateFixture';
import API from '../../../../shared/api/endpoints';
import './Kanban.scss';
import '../../../../components/web/team-name.js';

const getActiveMatchEmptyMessage = (isCoordinatingPitch) => (
  <>
    <span className="kanban-column-empty-state__title">No active match</span>
    <span className="kanban-column-empty-state__line">
      {isCoordinatingPitch ? (
        <>
          Press <strong>start</strong> when next match starts.
        </>
      ) : (
        'Match will be listed here when it starts'
      )}
    </span>
  </>
);

const LARGE_LIVE_CARD_MIN_HEIGHT_REM = 37;
const LARGE_LIVE_ROW_CHROME_REM = 9.2;
const LARGE_SOON_HEADER_HEIGHT_REM = 4.6;
const LARGE_SOON_ROW_HEIGHT_REM = 5.4;

const parseFixtureTime = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    const fromNumber = new Date(value);
    return Number.isNaN(fromNumber.getTime()) ? null : fromNumber;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const timeOnlyMatch = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!timeOnlyMatch) {
    return null;
  }

  const [, hh, mm] = timeOnlyMatch;
  const d = new Date();
  d.setHours(Number(hh), Number(mm), 0, 0);
  return Number.isNaN(d.getTime()) ? null : d;
};

const getMoveFixtureSortKey = (fixture) =>
  fixture?.scheduledTime || fixture?.plannedStart || '99:99';

const getFixtureLane = (fixture) => fixture?.lane?.current || getKanbanColumnLogic(fixture);

const isMoveListFixture = (fixture, selectedFixtureId) => {
  const lane = getFixtureLane(fixture);
  return (
    fixture?.id === selectedFixtureId ||
    lane === 'queued' ||
    lane === 'planned'
  );
}

const getMoveFixturePhase = (fixture) => {
  const normalizedStage = `${fixture?.stage || fixture?.bracket || fixture?.phase || ''}`
    .trim()
    .toLowerCase()

  return normalizedStage.includes('group') ||
    normalizedStage.includes('prelim')
    ? 'group'
    : 'knockout'
}

const isCompatibleMoveFixture = (fixture, candidateFixture) => {
  if (!fixture || !candidateFixture) return false
  return getMoveFixturePhase(fixture) === getMoveFixturePhase(candidateFixture)
}

const buildMovePreviewOrderIds = (fixture, targetPitch, fixtures) => {
  if (!fixture || !targetPitch) return [];

  const sortedFixtures = (fixtures || [])
    .filter(
      (item) =>
        item.id !== fixture.id &&
        item.pitch === targetPitch &&
        isMoveListFixture(item, fixture.id) &&
        isCompatibleMoveFixture(fixture, item)
    )
    .sort((left, right) =>
      getMoveFixtureSortKey(left).localeCompare(getMoveFixtureSortKey(right))
    );

  const orderedIds = sortedFixtures.map((item) => item.id);
  const insertionIndex = sortedFixtures.findIndex(
    (item) => getMoveFixtureSortKey(item) > getMoveFixtureSortKey(fixture)
  );

  if (insertionIndex === -1) {
    orderedIds.push(fixture.id);
  } else {
    orderedIds.splice(insertionIndex, 0, fixture.id);
  }

  return orderedIds;
};

const areMoveOrdersEqual = (left, right) => {
  if (left.length !== right.length) return false;

  return left.every((fixtureId, index) => fixtureId === right[index]);
};

// Helper function to determine fixture status (similar to useKanbanBoard.js)
const getKanbanColumnLogic = (fixture) => {
  if (!fixture) return 'planned'; // Default for safety, though fixtures should be valid
  if (fixture.played || fixture.actualEndedTime) {
    return 'finished';
  }
  if (fixture.actualStartedTime && !fixture.actualEndedTime) {
    return 'started';
  }
  return 'planned';
};

const Kanban = ({
  moveToNextFixture,
}) => {
  const {
    fixtures: initialFixtures,
    fetchFixtures,
    tournamentId,
    pitchId,
    allPitches,
    coordinatedPitches,
  } = useFixtureContext();
  const { filterSelections, updateFilterSelections } = useAppContext();
  const startMatchOriginal = useStartMatch(tournamentId, pitchId, fetchFixtures);

   // New state to track if details panel should be shown
   const [showingDetails, setShowingDetails] = useState(false);
   const [detailsMode, setDetailsMode] = useState('score'); // Default mode
   const [recentlyMovedFixtureId, setRecentlyMovedFixtureId] = useState(null);
   const [inlineMove, setInlineMove] = useState(null);
   const [isInlineMoveSaving, setIsInlineMoveSaving] = useState(false);
   const [visibleSoonRows, setVisibleSoonRows] = useState(0);
   const [largePaneHandlesSettling, setLargePaneHandlesSettling] = useState(true);
   const largeLivePaneRef = useRef(null);

  const {
    filteredFixtures,
    selectedFixture,
    setSelectedFixture,
    errorMessage,
    showError,
    selectedPitch,
    selectedTeam,
    pitches,
    teams,
    columns,
    getPitchColor,
    onDragStart,
    onDrop,
    onDragOver,
    handleFixtureClick,
    handlePitchChange,
    handleTeamChange,
  } = useKanbanBoard(initialFixtures, fetchFixtures, startMatchOriginal);

  // Derive available pitches for the selector (exclude 'All Pitches')
  const availablePitches = useMemo(() => {
    const pitchOptions = allPitches?.length
      ? allPitches
      : pitches.filter(p => p !== 'All Pitches');

    return Array.from(new Set(pitchOptions.filter(Boolean))).sort();
  }, [allPitches, pitches]);
  const coordinatedPitchSet = useMemo(
    () => new Set(coordinatedPitches || []),
    [coordinatedPitches]
  );

  // State for the focused pitch in the top section
  const [focusedPitch, setFocusedPitch] = useState(null);
  const [userClearedFocusedPitch, setUserClearedFocusedPitch] = useState(false);

  const routePitch = normalizePitchId(pitchId);
  const routePitchIsSelectable = routePitch && routePitch !== '*' && availablePitches.includes(routePitch);

  const preferredFocusedPitch = useMemo(() => {
    if (routePitchIsSelectable) return routePitch;

    return choosePreferredPitch({
      filterSelections,
      availablePitches,
      coordinatedPitches,
    });
  }, [availablePitches, coordinatedPitches, filterSelections, routePitch, routePitchIsSelectable]);

  const persistActivePitch = (nextPitch) => {
    if (!nextPitch) return;
    const currentActivePitch = normalizePitchId(filterSelections?.pitches?.active || filterSelections?.activePitch);
    if (currentActivePitch === nextPitch) return;

    updateFilterSelections({
      ...filterSelections,
      pitches: {
        ...(filterSelections?.pitches || {}),
        active: nextPitch,
      },
      activePitch: nextPitch,
    });
  };

  const pinnedPitches = useMemo(() => {
    const primary = normalizePitchId(filterSelections?.pitches?.primary);
    const additional = Array.isArray(filterSelections?.pitches?.additional)
      ? filterSelections.pitches.additional.map(normalizePitchId)
      : [];
    const fallback = (coordinatedPitches || []).map(normalizePitchId);

    return Array.from(new Set([
      primary,
      ...additional,
      ...fallback,
    ].filter(Boolean)));
  }, [coordinatedPitches, filterSelections]);

  const persistPinnedPitches = (nextPitches, activePitch) => {
    const normalized = Array.from(new Set(
      (nextPitches || []).map(normalizePitchId).filter(Boolean)
    ));
    const [primary = null, ...additional] = normalized;
    const active = normalizePitchId(activePitch) || primary;

    updateFilterSelections({
      ...filterSelections,
      pitches: {
        ...(filterSelections?.pitches || {}),
        primary,
        additional,
        active,
      },
      Pitches: normalized,
      activePitch: active,
    });
  };

  // Initialize focusedPitch from the active coordinated pitch, then fall back to the first coordinated pitch.
  useEffect(() => {
    if (!availablePitches.length || !preferredFocusedPitch) return;

    if (userClearedFocusedPitch && focusedPitch === null) return;

    if (!focusedPitch || !availablePitches.includes(focusedPitch)) {
      setFocusedPitch(preferredFocusedPitch);
    }
  }, [availablePitches, focusedPitch, preferredFocusedPitch, userClearedFocusedPitch]);

  const isInlineMoveActive = Boolean(inlineMove && selectedFixture);
  const activeMovePitch = isInlineMoveActive ? inlineMove.targetPitch : null;
  const initialInlineMoveOrderIds = useMemo(() => {
    if (!selectedFixture || !activeMovePitch) return [];

    return buildMovePreviewOrderIds(
      selectedFixture,
      activeMovePitch,
      initialFixtures || []
    );
  }, [activeMovePitch, initialFixtures, selectedFixture]);

  const inlineMoveFixturesById = useMemo(() => {
    const fixturesById = new Map(
      (initialFixtures || []).map((fixture) => [fixture.id, fixture])
    );

    if (selectedFixture && activeMovePitch) {
      fixturesById.set(selectedFixture.id, {
        ...selectedFixture,
        pitch: activeMovePitch,
        lane: {
          ...(selectedFixture.lane || {}),
          current: 'planned',
        },
      });
    }

    return fixturesById;
  }, [activeMovePitch, initialFixtures, selectedFixture]);

  const inlineMovePreviewFixtures = useMemo(() => {
    if (!isInlineMoveActive) return [];

    return (inlineMove.previewOrderIds || [])
      .map((fixtureId) => inlineMoveFixturesById.get(fixtureId) || null)
      .filter(Boolean);
  }, [inlineMove, inlineMoveFixturesById, isInlineMoveActive]);

  const inlineMovePreviewIndexMap = useMemo(() => {
    return new Map(
      (inlineMove?.previewOrderIds || []).map((fixtureId, index) => [
        fixtureId,
        index,
      ])
    );
  }, [inlineMove?.previewOrderIds]);

  const inlineMovePreviewIdSet = useMemo(
    () => new Set(inlineMove?.previewOrderIds || []),
    [inlineMove?.previewOrderIds]
  );

  const inlineMoveCurrentIndex = selectedFixture
    ? inlineMove?.previewOrderIds?.indexOf(selectedFixture.id) ?? -1
    : -1;
  const inlineMoveSlackMinutes = inlineMove?.slackMinutes || 0;
  const hasInlineMoveSlack = inlineMoveSlackMinutes !== 0;
  const inlineMoveSwapFixture = inlineMove?.swapFixtureId
    ? inlineMoveFixturesById.get(inlineMove.swapFixtureId) || null
    : null;
  const inlineMoveHasReferenceFixture = inlineMovePreviewFixtures.length > 1;
  const inlineMoveHasPositionChange =
    isInlineMoveActive &&
    selectedFixture &&
    (activeMovePitch !== selectedFixture.pitch ||
      !!inlineMove?.swapFixtureId ||
      !areMoveOrdersEqual(
        inlineMove.previewOrderIds || [],
        initialInlineMoveOrderIds
      ));
  const canAdjustInlineSlack = isInlineMoveActive && !inlineMoveHasPositionChange;
  const inlineMoveIsUnchanged =
    isInlineMoveActive &&
    activeMovePitch === selectedFixture.pitch &&
    !inlineMove?.swapFixtureId &&
    inlineMoveSlackMinutes === 0 &&
    areMoveOrdersEqual(
      inlineMove.previewOrderIds || [],
      initialInlineMoveOrderIds
    );

  const resolvedInlineMove = useMemo(() => {
    if (!isInlineMoveActive || !selectedFixture) {
      return { placement: null, targetFixture: null };
    }

    if (inlineMove?.swapFixtureId) {
      return {
        placement: 'swap',
        targetFixture: inlineMoveSwapFixture,
      };
    }

    if (!inlineMoveHasReferenceFixture || inlineMoveCurrentIndex === -1) {
      return { placement: null, targetFixture: null };
    }

    if (inlineMoveCurrentIndex === 0) {
      return {
        placement: 'before',
        targetFixture: inlineMovePreviewFixtures[1] || null,
      };
    }

    return {
      placement: 'after',
      targetFixture: inlineMovePreviewFixtures[inlineMoveCurrentIndex - 1] || null,
    };
  }, [
    inlineMove?.swapFixtureId,
    inlineMoveCurrentIndex,
    inlineMoveHasReferenceFixture,
    inlineMovePreviewFixtures,
    inlineMoveSwapFixture,
    isInlineMoveActive,
    selectedFixture,
  ]);

  const canConfirmInlineMove = isInlineMoveActive
    ? inlineMoveIsUnchanged
      ? true
      : hasInlineMoveSlack
        ? !isInlineMoveSaving
        : Boolean(
          activeMovePitch &&
            resolvedInlineMove.placement &&
            resolvedInlineMove.targetFixture?.id &&
            !isInlineMoveSaving
        )
    : false;

  const boardPitch = focusedPitch;
  const hasManagedPitchSelection = coordinatedPitchSet.size > 0;
  const isCoordinatingBoardPitch = boardPitch
    ? !hasManagedPitchSelection || coordinatedPitchSet.has(boardPitch)
    : !hasManagedPitchSelection;
  const boardSlotPitches = boardPitch ? [boardPitch] : availablePitches;
  const isViewingInlineMoveTarget =
    isInlineMoveActive && boardPitch === activeMovePitch;
  const boardFixtureSource = useMemo(() => {
    if (!isInlineMoveActive || !selectedFixture || !activeMovePitch) {
      return filteredFixtures;
    }

    const fixturesWithoutSelected = (initialFixtures || []).filter(
      (fixture) => fixture.id !== selectedFixture.id
    );

    return [
      ...fixturesWithoutSelected,
      {
        ...selectedFixture,
        pitch: activeMovePitch,
        lane: {
          ...(selectedFixture.lane || {}),
          current: 'planned',
        },
      },
    ];
  }, [
    activeMovePitch,
    filteredFixtures,
    initialFixtures,
    isInlineMoveActive,
    selectedFixture,
  ]);

  const pitchFilteredFixtures = useMemo(() => {
    if (!boardPitch) return boardFixtureSource;
    return boardFixtureSource.filter((fixture) => fixture.pitch === boardPitch);
  }, [boardFixtureSource, boardPitch]);

  const globalPlannedFixtures = useMemo(() => {
    // For the warning icon, we still need to know about all planned fixtures globally
    if (initialFixtures && initialFixtures.length > 0) {
      return initialFixtures.filter(fixture => getKanbanColumnLogic(fixture) === 'planned');
    }
    return [];
  }, [initialFixtures]);

  const pitchStatuses = useMemo(() => {
    const grouped = {};

    (initialFixtures || []).forEach((fixture) => {
      const pitch = fixture?.pitch;
      if (!pitch) return;

      if (!grouped[pitch]) {
        grouped[pitch] = {
          hasLiveMatch: false,
          liveStartedAtMs: null,
          queuedCount: 0,
          startedCount: 0,
          plannedCount: 0,
          finishedCount: 0,
        };
      }

      const lane = fixture?.lane?.current || getKanbanColumnLogic(fixture);

      if (lane === 'queued') {
        grouped[pitch].queuedCount += 1;
      } else if (lane === 'started') {
        grouped[pitch].startedCount += 1;
      } else if (lane === 'planned') {
        grouped[pitch].plannedCount += 1;
      } else if (lane === 'finished') {
        grouped[pitch].finishedCount += 1;
      }

      if (lane === 'started') {
        const startedAt =
          parseFixtureTime(fixture.actualStartedTime) ||
          parseFixtureTime(fixture.started) ||
          parseFixtureTime(fixture.startedTime);

        const startedMs = startedAt ? startedAt.getTime() : null;
        const currentMs = grouped[pitch].liveStartedAtMs;

        grouped[pitch].hasLiveMatch = true;
        grouped[pitch].liveStartedAtMs =
          startedMs && (!currentMs || startedMs < currentMs)
            ? startedMs
            : (currentMs || startedMs);
      }

    });

    Object.values(grouped).forEach((status) => {
      const remainingCount = status.queuedCount + status.startedCount + status.plannedCount;
      status.remainingCount = remainingCount;
      status.isComplete = status.finishedCount > 0 && remainingCount === 0;
    });

    return grouped;
  }, [initialFixtures]);

  const focusedPitchStatus = boardPitch ? pitchStatuses[boardPitch] || null : null;
  const showPitchCompleteBanner = !!focusedPitchStatus?.isComplete;
  const activeMatchEmptyMessage = getActiveMatchEmptyMessage(isCoordinatingBoardPitch);

  const renderBoardInfoBar = () => {
    const isReadOnly = !isCoordinatingBoardPitch;

    const getGuidanceMessage = () => {
      if (!boardPitch) {
        return 'SELECT A PITCH OR TAP ON FIXTURE TO VIEW OPTIONS';
      }
      if (!selectedFixture) {
        return 'TAP ON FIXTURE TO VIEW OPTIONS';
      }
      if (largePane === 'planning') {
        return 'SLIDE RIGHT TO VIEW ACTIVE MATCHES';
      }
      if (largePane === 'live') {
        return 'SLIDE LEFT/RIGHT FOR PLANNED/FINISHED FIXTURES';
      }
      if (largePane === 'finished') {
        return 'SLIDE LEFT TO VIEW ACTIVE MATCHES';
      }
      return '';
    };

    return (
      <div className={`kanban-board-info-bar ${isReadOnly ? 'is-read-only' : 'is-guidance'}`}>
        <i
          className={`kanban-board-info-bar__icon pi ${
            isReadOnly ? 'pi-exclamation-triangle' : 'pi-info-circle'
          }`}
          aria-hidden="true"
        />
        <span className="kanban-board-info-bar__message">
          {isReadOnly
            ? (
              <>
                <strong>Read-only:</strong> {boardPitch ? 'You are not coordinating this pitch' : 'Select a pitch to coordinate fixtures'}
              </>
            )
            : getGuidanceMessage()}
        </span>
      </div>
    );
  };

  // Effect to update selectedFixture when initialFixtures (from context) changes
  useEffect(() => {
    if (selectedFixture?.id) {
      const updatedFixtureFromList = initialFixtures.find(f => f.id === selectedFixture.id);
      if (updatedFixtureFromList) {
        // Update selectedFixture with the latest data from the refreshed list
        // This ensures that if the fixture data changed in the context,
        // the selectedFixture state reflects these changes.
        if (JSON.stringify(selectedFixture) !== JSON.stringify(updatedFixtureFromList)) {
          setSelectedFixture(updatedFixtureFromList);
        }
      } else {
        // Optionally, if the selected fixture is no longer in the list,
        // you might want to clear it, e.g., setSelectedFixture(null);
        // For now, we only update if found.
      }
    }
  }, [initialFixtures, selectedFixture?.id, setSelectedFixture, selectedFixture]);

  useEffect(() => {
    if (!selectedFixture) return;

    const fixtureVisible = pitchFilteredFixtures.some((fixture) => fixture.id === selectedFixture.id);
    if (!fixtureVisible && !isInlineMoveActive) {
      setSelectedFixture(null);
    }
  }, [isInlineMoveActive, pitchFilteredFixtures, selectedFixture, setSelectedFixture]);

  useEffect(() => {
    setInlineMove(null);
    setIsInlineMoveSaving(false);
  }, [selectedFixture?.id]);


   // Function to show full details panel
   const showDetailsPanel = (mode = 'score') => {
     setInlineMove(null);
     setDetailsMode(mode);
     setShowingDetails(true);
   };

   // Function to close details panel
   const closeDetailsPanel = () => {
     setShowingDetails(false);
     setDetailsMode('info'); // Reset mode to info
     // setSelectedFixture(null); // Consider if this is still needed or handled elsewhere
   };

   const startInlineMoveMode = () => {
     if (!selectedFixture) return;

     const targetPitch = selectedFixture.pitch;

     setShowingDetails(false);
     setInlineMove({
       targetPitch,
       previewOrderIds: buildMovePreviewOrderIds(
         selectedFixture,
         targetPitch,
         initialFixtures || []
       ),
       swapFixtureId: null,
       slackMinutes: 0,
     });
     setFocusedPitch(targetPitch);
   };

   const cancelInlineMoveMode = () => {
     setInlineMove(null);
     setIsInlineMoveSaving(false);
   };

   const setInlineMovePitch = (nextPitch) => {
     if (!selectedFixture || !nextPitch || hasInlineMoveSlack) return;

     setInlineMove({
       targetPitch: nextPitch,
       previewOrderIds: buildMovePreviewOrderIds(
         selectedFixture,
         nextPitch,
         initialFixtures || []
       ),
       swapFixtureId: null,
       slackMinutes: 0,
     });
   };

   const adjustInlineMoveSlack = (deltaMinutes) => {
     if (!selectedFixture || !deltaMinutes) return;

     setInlineMove((previousMove) => {
       if (!previousMove) return previousMove;
       const hasPositionChange =
         previousMove.targetPitch !== selectedFixture.pitch ||
         !!previousMove.swapFixtureId ||
         !areMoveOrdersEqual(
           previousMove.previewOrderIds || [],
           initialInlineMoveOrderIds
         );

       if (hasPositionChange) return previousMove;

       return {
         ...previousMove,
         slackMinutes: (previousMove.slackMinutes || 0) + deltaMinutes,
       };
     });
   };

   const setInlineMoveToFocusedPitch = () => {
     if (!focusedPitch) return;
     setInlineMovePitch(focusedPitch);
   };

   const moveInlineFixture = (offset) => {
     if (!selectedFixture || hasInlineMoveSlack) return;

     setInlineMove((previousMove) => {
       if (!previousMove) return previousMove;

       const fromIndex = previousMove.previewOrderIds.indexOf(selectedFixture.id);
       const toIndex = fromIndex + offset;

       if (
         fromIndex === -1 ||
         toIndex < 0 ||
         toIndex >= previousMove.previewOrderIds.length
       ) {
         return previousMove;
       }

       const nextOrder = [...previousMove.previewOrderIds];
       [nextOrder[fromIndex], nextOrder[toIndex]] = [
         nextOrder[toIndex],
         nextOrder[fromIndex],
       ];

       return {
         ...previousMove,
         previewOrderIds: nextOrder,
         swapFixtureId: null,
         slackMinutes: 0,
       };
     });
   };

   const swapInlineFixture = (fixtureId) => {
     if (!selectedFixture || !fixtureId || hasInlineMoveSlack) return;

     setInlineMove((previousMove) => {
       if (!previousMove || fixtureId === selectedFixture.id) return previousMove;

       const currentIndex = previousMove.previewOrderIds.indexOf(selectedFixture.id);
       const targetIndex = previousMove.previewOrderIds.indexOf(fixtureId);

       if (currentIndex === -1 || targetIndex === -1) {
         return previousMove;
       }

       const nextOrder = [...previousMove.previewOrderIds];
       [nextOrder[currentIndex], nextOrder[targetIndex]] = [
         nextOrder[targetIndex],
         nextOrder[currentIndex],
       ];

       return {
         ...previousMove,
         previewOrderIds: nextOrder,
          swapFixtureId:
           previousMove.swapFixtureId === fixtureId ? null : fixtureId,
         slackMinutes: 0,
       };
     });
   };

   const confirmInlineMove = async () => {
     if (!selectedFixture || !canConfirmInlineMove) return;

     if (inlineMoveIsUnchanged) {
       cancelInlineMoveMode();
       return;
     }

     try {
       setIsInlineMoveSaving(true);
       if (hasInlineMoveSlack) {
         await API.slackMatch(
           selectedFixture.tournamentId,
           selectedFixture.id,
           inlineMoveSlackMinutes
         );
       } else {
         await API.rescheduleMatch(
           selectedFixture.tournamentId,
           activeMovePitch,
           selectedFixture.id,
           resolvedInlineMove.targetFixture.id,
           resolvedInlineMove.placement
         );
       }
       await fetchFixtures(true);
       setRecentlyMovedFixtureId(selectedFixture.id);
       setTimeout(() => setRecentlyMovedFixtureId(null), 2000);
       cancelInlineMoveMode();
     } catch (error) {
       console.error('Error moving fixture:', error);
       showError('Could not apply the move.');
     } finally {
       setIsInlineMoveSaving(false);
     }
   };

   const handleFocusedPitchSelect = (nextPitch) => {
     const safePitch = normalizePitchId(nextPitch);
     if (!safePitch) return;

     if (!pinnedPitches.includes(safePitch)) {
       persistPinnedPitches([...pinnedPitches, safePitch], safePitch);
     } else {
       persistActivePitch(safePitch);
     }

     setUserClearedFocusedPitch(false);
     setFocusedPitch(safePitch);
     setSelectedFixture(null);
     setShowingDetails(false);
     if (inlineMove) {
       cancelInlineMoveMode();
     }
   };

   const handlePitchSelectionCommit = (nextPitches, nextActivePitch) => {
     const normalized = Array.from(new Set(
       (nextPitches || []).map(normalizePitchId).filter(Boolean)
     ));
     if (!normalized.length) return;

     const active = normalized.includes(normalizePitchId(nextActivePitch))
       ? normalizePitchId(nextActivePitch)
       : normalized[0];

     persistPinnedPitches(normalized, active);
     setUserClearedFocusedPitch(false);
     setFocusedPitch(active);
     setSelectedFixture(null);
     setShowingDetails(false);
     if (inlineMove) {
       cancelInlineMoveMode();
     }
   };

  useEffect(() => {
    if (isCoordinatingBoardPitch) return;
    setShowingDetails(false);
    if (inlineMove) {
      cancelInlineMoveMode();
    }
  }, [isCoordinatingBoardPitch]);

  const sortFixturesForDisplay = (fixtures) => {
    if (!isInlineMoveActive) return fixtures;

    return [...fixtures].sort((left, right) => {
      const leftPreviewIndex = inlineMovePreviewIndexMap.get(left.id);
      const rightPreviewIndex = inlineMovePreviewIndexMap.get(right.id);
      const leftInPreview = leftPreviewIndex !== undefined;
      const rightInPreview = rightPreviewIndex !== undefined;

      if (leftInPreview && rightInPreview) {
        return leftPreviewIndex - rightPreviewIndex;
      }

      if (left.id === selectedFixture?.id) return -1;
      if (right.id === selectedFixture?.id) return 1;

      return getMoveFixtureSortKey(left).localeCompare(getMoveFixtureSortKey(right));
    });
  };

  const prioritizeSelectedFixture = (fixtures) => {
    if (!isInlineMoveActive || !selectedFixture) return fixtures;

    return [...fixtures].sort((left, right) => {
      if (left.id === selectedFixture.id) return -1;
      if (right.id === selectedFixture.id) return 1;
      return 0;
    });
  };

  const formatInlineMoveFixtureLabel = (fixture) => {
    if (!fixture) return 'fixture';

    const team1 = fixture.team1 || 'T.B.D.';
    const team2 = fixture.team2 || 'T.B.D.';
    return `${team1} vs ${team2}`;
  };

  const inlineMoveSummary = inlineMoveIsUnchanged
    ? 'Choose a pitch or move the fixture earlier/later'
    : hasInlineMoveSlack
      ? `Apply ${inlineMoveSlackMinutes > 0 ? '+' : ''}${inlineMoveSlackMinutes}m slack`
    : inlineMoveSwapFixture
      ? `Swap with ${formatInlineMoveFixtureLabel(inlineMoveSwapFixture)}`
      : resolvedInlineMove.targetFixture
        ? `${
            resolvedInlineMove.placement === 'before' ? 'Before' : 'After'
          } ${formatInlineMoveFixtureLabel(resolvedInlineMove.targetFixture)}`
        : `Move on ${activeMovePitch || selectedFixture?.pitch}`;

  const [largePane, setLargePane] = useState('live');
  const [largePaneDragOffset, setLargePaneDragOffset] = useState(0);
  const largePaneTouchRef = useRef({
    startX: 0,
    startY: 0,
    currentX: 0,
    intent: null,
    isSwiping: false,
  });
  const largePaneSwipeStartThreshold = 18;
  // A 1:1 axis ratio is 45 degrees; vertical intent locks out lane switching.
  const largePaneSwipeAxisRatio = 1;
  const largePaneOrder = ['planning', 'live', 'finished'];

  const largePaneMeta = {
    planning: { label: 'planned', next: 'live' },
    live: { label: 'next', previous: 'planning', next: 'finished' },
    finished: { label: 'finished', previous: 'live' },
  };

  useEffect(() => {
    if (isInlineMoveActive) return undefined;

    setLargePaneHandlesSettling(true);
    const timerId = window.setTimeout(() => {
      setLargePaneHandlesSettling(false);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [isInlineMoveActive, largePane]);

  const navigateLargePane = (nextPane) => {
    if (!nextPane || nextPane === largePane) return;

    setSelectedFixture(null);
    setShowingDetails(false);
    setDetailsMode('info');
    setInlineMove(null);
    setLargePane(nextPane);
  };

  const handleLargePaneTouchStart = (event) => {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    largePaneTouchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      intent: null,
      isSwiping: false,
    };
    setLargePaneDragOffset(0);
  };

  const handleLargePaneTouchMove = (event) => {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    const gesture = largePaneTouchRef.current;
    const deltaX = touch.clientX - gesture.startX;
    const deltaY = touch.clientY - gesture.startY;
    const absoluteX = Math.abs(deltaX);
    const absoluteY = Math.abs(deltaY);

    if (!gesture.intent) {
      if (Math.max(absoluteX, absoluteY) < largePaneSwipeStartThreshold) return;

      if (absoluteY / Math.max(absoluteX, 1) >= largePaneSwipeAxisRatio) {
        gesture.intent = 'vertical';
        return;
      }

      if (absoluteX / Math.max(absoluteY, 1) <= largePaneSwipeAxisRatio) return;

      gesture.intent = 'horizontal';
      gesture.isSwiping = true;
    }

    if (gesture.intent !== 'horizontal') return;

    event.preventDefault();
    gesture.currentX = touch.clientX;

    const paneIndex = largePaneOrder.indexOf(largePane);
    const isDraggingPastStart = paneIndex === 0 && deltaX > 0;
    const isDraggingPastEnd = paneIndex === largePaneOrder.length - 1 && deltaX < 0;
    const constrainedDelta = isDraggingPastStart || isDraggingPastEnd ? deltaX * 0.28 : deltaX;

    setLargePaneDragOffset(constrainedDelta);
  };

  const handleLargePaneTouchEnd = () => {
    const gesture = largePaneTouchRef.current;
    const deltaX = gesture.currentX - gesture.startX;
    const paneIndex = largePaneOrder.indexOf(largePane);
    const swipeThreshold = Math.min(110, window.innerWidth * 0.22);

    if (gesture.isSwiping && Math.abs(deltaX) >= swipeThreshold) {
      if (deltaX < 0 && paneIndex < largePaneOrder.length - 1) {
        navigateLargePane(largePaneOrder[paneIndex + 1]);
      } else if (deltaX > 0 && paneIndex > 0) {
        navigateLargePane(largePaneOrder[paneIndex - 1]);
      }
    }

    largePaneTouchRef.current = {
      startX: 0,
      startY: 0,
      currentX: 0,
      intent: null,
      isSwiping: false,
    };
    setLargePaneDragOffset(0);
  };

  const renderFixtureActionRail = (fixture) => {
    if (
      !isCoordinatingBoardPitch ||
      !selectedFixture ||
      !fixture ||
      fixture.id !== selectedFixture.id
    ) {
      return null;
    }

    return (
      <UpdateFixture
        moveToNextFixture={moveToNextFixture}
        fixture={selectedFixture}
        showDetails={showDetailsPanel}
        closeDetails={closeDetailsPanel}
        isDetailsMode={showingDetails}
        isInlineMoveMode={isInlineMoveActive}
        inlineMoveTargetPitch={boardPitch}
        inlineMoveSummary={inlineMoveSummary}
        onStartInlineMove={startInlineMoveMode}
        onCancelInlineMove={cancelInlineMoveMode}
        onSetInlineMovePitch={setInlineMoveToFocusedPitch}
        onMoveInlineEarlier={() => moveInlineFixture(-1)}
        onMoveInlineLater={() => moveInlineFixture(1)}
        onConfirmInlineMove={confirmInlineMove}
        canConfirmInlineMove={canConfirmInlineMove}
        canSetInlineMovePitch={
          !hasInlineMoveSlack &&
          Boolean(focusedPitch) &&
          !isViewingInlineMoveTarget
        }
        canMoveInlineEarlier={
          !hasInlineMoveSlack &&
          isViewingInlineMoveTarget &&
          inlineMoveCurrentIndex > 0
        }
        canMoveInlineLater={
          !hasInlineMoveSlack &&
          isViewingInlineMoveTarget &&
          inlineMoveCurrentIndex > -1 &&
          inlineMoveCurrentIndex < (inlineMove?.previewOrderIds?.length || 0) - 1
        }
        isInlineMoveUnchanged={inlineMoveIsUnchanged}
        canStartInlineMove={Boolean(
          selectedFixture &&
            !showingDetails &&
            (selectedFixture?.lane?.current === 'planned' ||
              selectedFixture?.lane?.current === 'queued')
        )}
        isInlineMoveSaving={isInlineMoveSaving}
        variant="rail"
      />
    );
  };

  const queuedFixturesForView = prioritizeSelectedFixture(
    pitchFilteredFixtures.filter(f => f?.lane?.current === 'queued')
  );
  const plannedFixturesForView = sortFixturesForDisplay(
    pitchFilteredFixtures.filter((fixture) =>
      (isInlineMoveActive
        ? isMoveListFixture(fixture, selectedFixture?.id) &&
          isCompatibleMoveFixture(selectedFixture, fixture)
        : getFixtureLane(fixture) === 'planned') &&
      (!isInlineMoveActive ||
        !isViewingInlineMoveTarget ||
        inlineMovePreviewIdSet.has(fixture.id))
    )
  );
  const startedFixturesForView = prioritizeSelectedFixture(
    pitchFilteredFixtures.filter(f => f?.lane?.current === 'started')
  );
  const finishedFixturesForView = sortFixturesForDisplay(
    pitchFilteredFixtures
      .filter(f => f?.lane?.current === 'finished')
      .sort((a, b) => {
        const dateA = a.ended ? new Date(a.ended) : 0;
        const dateB = b.ended ? new Date(b.ended) : 0;
        return dateB - dateA;
      })
  );
  const soonFixturesForView = plannedFixturesForView.slice(0, 2);
  const visibleSoonFixtures = soonFixturesForView.slice(0, visibleSoonRows);

  useEffect(() => {
    if (isInlineMoveActive) {
      setVisibleSoonRows(0);
      return undefined;
    }

    const pane = largeLivePaneRef.current;
    if (!pane) return undefined;

    const getRemSize = () => {
      const parsedRem = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
      return Number.isFinite(parsedRem) && parsedRem > 0 ? parsedRem : 10;
    };

    const updateVisibleSoonRows = () => {
      const maxFixtureRows = Math.min(2, plannedFixturesForView.length);
      if (maxFixtureRows <= 0) {
        setVisibleSoonRows(0);
        return;
      }

      const remSize = getRemSize();
      const minimumLiveRowsHeight =
        2 * (LARGE_LIVE_CARD_MIN_HEIGHT_REM + LARGE_LIVE_ROW_CHROME_REM) * remSize;
      const availableSoonHeight = pane.clientHeight - minimumLiveRowsHeight;
      let nextVisibleRows = 0;

      for (let rowCount = maxFixtureRows; rowCount > 0; rowCount -= 1) {
        const requiredSoonHeight =
          (LARGE_SOON_HEADER_HEIGHT_REM + (rowCount * LARGE_SOON_ROW_HEIGHT_REM)) * remSize;

        if (availableSoonHeight >= requiredSoonHeight) {
          nextVisibleRows = rowCount;
          break;
        }
      }

      setVisibleSoonRows(nextVisibleRows);
    };

    updateVisibleSoonRows();

    const resizeObserver = new ResizeObserver(updateVisibleSoonRows);
    resizeObserver.observe(pane);
    window.addEventListener('resize', updateVisibleSoonRows);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateVisibleSoonRows);
    };
  }, [
    isInlineMoveActive,
    plannedFixturesForView.length,
  ]);

  const renderColumn = (columnKey, fixtures, overrides = {}) => (
    <KanbanColumn
      key={columnKey}
      columnKey={columnKey}
      title={overrides.title || columnKey}
      columnIndex={overrides.columnIndex || 0}
      fixtures={fixtures}
      allPlannedFixtures={overrides.allPlannedFixtures}
      onDrop={(e) => isCoordinatingBoardPitch && onDrop(e, columnKey)}
      onDragOver={onDragOver}
      onDragStart={isCoordinatingBoardPitch ? onDragStart : () => {}}
      handleFixtureClick={handleFixtureClick}
      selectedFixture={selectedFixture}
      getPitchColor={getPitchColor}
      allTournamentPitches={overrides.allTournamentPitches || null}
      setMoveBarFixtureId={null}
      recentlyMovedFixtureId={recentlyMovedFixtureId}
      isInlineMoveMode={isInlineMoveActive}
      inlineMoveFixtureId={selectedFixture?.id || null}
      inlineMoveTargetPitch={activeMovePitch}
      inlineMoveSwapFixtureId={inlineMove?.swapFixtureId || null}
      onInlineMoveUp={() => moveInlineFixture(-1)}
      onInlineMoveDown={() => moveInlineFixture(1)}
      onInlineSwap={swapInlineFixture}
      canInlineMoveUp={inlineMoveCurrentIndex > 0}
      canInlineMoveDown={
        inlineMoveCurrentIndex > -1 &&
        inlineMoveCurrentIndex < (inlineMove?.previewOrderIds?.length || 0) - 1
      }
      inlineMoveSlackMinutes={inlineMoveSlackMinutes}
      onAdjustInlineSlack={adjustInlineMoveSlack}
      canAdjustInlineSlack={canAdjustInlineSlack}
      emptyMessage={overrides.emptyMessage}
      renderFixtureActionRail={renderFixtureActionRail}
      hideActionRail={!isCoordinatingBoardPitch || !selectedFixture}
    />
  );

  const CompactFixtureTeams = ({ team1, team2 }) => {
    const wrapRef = useRef(null)
    const contentRef = useRef(null)
    const [isOverflowing, setIsOverflowing] = useState(false)

    useEffect(() => {
      const wrap = wrapRef.current
      const content = contentRef.current
      if (!wrap || !content) return

      const checkOverflow = () => {
        const overflowing = content.scrollWidth > wrap.clientWidth
        setIsOverflowing(overflowing)
        if (overflowing) {
          const distance = content.scrollWidth - wrap.clientWidth + 16 // extra padding
          wrap.style.setProperty('--ticker-distance', `-${distance}px`)
        }
      }

      checkOverflow()
      const ro = new ResizeObserver(checkOverflow)
      ro.observe(wrap)
      ro.observe(content)
      return () => ro.disconnect()
    }, [team1, team2])

    return (
      <span ref={wrapRef} className={`kanban-compact-fixture__teams ${isOverflowing ? 'is-overflowing' : ''}`}>
        <span ref={contentRef} className="kanban-compact-fixture__teams-inner">
          <team-name
            name={team1 || 'TBD'}
            showLogo="false"
            height="16px"
            maxchars="20"
          />
          <span className="kanban-compact-fixture__vs">vs</span>
          <team-name
            name={team2 || 'TBD'}
            showLogo="false"
            height="16px"
            maxchars="20"
          />
        </span>
      </span>
    )
  }

  const renderCompactFixtureSummary = (fixture) => {
    if (!fixture) return null;

    const normalizePrefix = (value) => {
      const trimmed = typeof value === 'string' ? value.trim() : ''
      if (!trimmed || trimmed.toUpperCase() === 'N/A') return ''
      return trimmed
    }

    const derivePrefix = (value) => {
      const text = typeof value === 'string' ? value.trim() : ''
      if (!text) return ''
      return text[0].toUpperCase()
    }

    const category = fixture.category ? fixture.category.substring(0, 9).toUpperCase() : ''
    const competitionPrefix = fixture?.competition?.initials
    const resolvedPrefix = normalizePrefix(competitionPrefix) || derivePrefix(category) || '?'
    const formattedId = `${resolvedPrefix}.${`${fixture.id}`.padStart(2, '?').slice(-2)}`

    return (
      <div className="kanban-compact-fixture">
        <span className="kanban-compact-fixture__time">{fixture.scheduledTime || '--:--'}</span>
        <span className="kanban-compact-fixture__id">{formattedId}</span>
        <CompactFixtureTeams team1={fixture.team1} team2={fixture.team2} />
      </div>
    );
  };

  const renderSoonFixtures = () => (
    <div className="kanban-soon-fixtures">
      <div className="kanban-soon-fixtures__header">
        soon <span>({visibleSoonFixtures.length})</span>
      </div>
      {visibleSoonFixtures.map((fixture) => (
        <button
          type="button"
          key={fixture.id}
          className="kanban-soon-fixtures__row"
          onClick={() => handleFixtureClick(fixture)}
        >
          {renderCompactFixtureSummary(fixture)}
        </button>
      ))}
    </div>
  );

  const largePaneTabs = [
    {
      key: 'planning',
      label: 'Planned',
      count: plannedFixturesForView.length,
    },
    {
      key: 'live',
      label: 'Next',
      count: startedFixturesForView.length + queuedFixturesForView.length,
    },
    {
      key: 'finished',
      label: 'Finished',
      count: finishedFixturesForView.length,
    },
  ];

  if (!isInlineMoveActive) {
    const activePane = largePaneMeta[largePane];

    return (
      <div className={`kanban-view kanban-view-large ${selectedFixture ? 'fixture-selected' : ''} ${showingDetails ? 'details-visible' : ''}`}>
        <KanbanErrorMessage message={errorMessage} />
        <div className="kanban-board-area">
          <div className="kanban-pitch-selector-area">
            <PitchSelector
              pitches={availablePitches}
              selectedPitch={boardPitch}
              onSelectPitch={handleFocusedPitchSelect}
              onSelectionCommit={handlePitchSelectionCommit}
              pitchStatuses={pitchStatuses}
              coordinatedPitches={pinnedPitches}
            />
          </div>
          {renderBoardInfoBar()}
          <div
            className="kanban-large-shell"
            onTouchStart={handleLargePaneTouchStart}
            onTouchMove={handleLargePaneTouchMove}
            onTouchEnd={handleLargePaneTouchEnd}
            onTouchCancel={handleLargePaneTouchEnd}
          >
            <div className="kanban-large-tabs" role="tablist" aria-label="Schedule lanes">
              {largePaneTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`kanban-large-tabs__tab ${largePane === tab.key ? 'is-active' : ''}`}
                  onClick={() => navigateLargePane(tab.key)}
                  role="tab"
                  aria-selected={largePane === tab.key}
                >
                  <strong>{tab.label}</strong>
                  <small>{tab.count} matches</small>
                </button>
              ))}
            </div>
            <div className="kanban-large-pane-viewport">
              <div
                className={`kanban-large-panes active-${largePane} ${
                  largePaneDragOffset ? 'is-dragging' : ''
                }`}
                style={{ '--large-pane-drag-offset': `${largePaneDragOffset}px` }}
              >
                <section className="kanban-large-pane kanban-large-pane-planning">
                  {renderColumn('planned', plannedFixturesForView, {
                    title: 'Planned',
                    columnIndex: 1,
                  })}
                </section>
                <section
                  ref={largeLivePaneRef}
                  className="kanban-large-pane kanban-large-pane-live"
                >
                  {showPitchCompleteBanner && (
                    <div className="pitch-complete-banner">
                      <div className="pitch-complete-banner__eyebrow">{boardPitch} complete</div>
                      <div className="pitch-complete-banner__headline">
                        This pitch has played its final match.
                      </div>
                      <div className="pitch-complete-banner__subtext">
                        Nothing left to queue or start.
                      </div>
                    </div>
                  )}
                  {renderColumn('started', startedFixturesForView, {
                    title: 'Ongoing',
                    columnIndex: 2,
                    allTournamentPitches: boardSlotPitches,
                    allPlannedFixtures: globalPlannedFixtures,
                    emptyMessage: activeMatchEmptyMessage,
                  })}
                  {renderColumn('queued', queuedFixturesForView, {
                    title: 'Up next',
                    columnIndex: 0,
                    allTournamentPitches: boardSlotPitches,
                  })}
                  {visibleSoonFixtures.length > 0 && renderSoonFixtures()}
                </section>
                <section className="kanban-large-pane kanban-large-pane-finished">
                  {renderColumn('finished', finishedFixturesForView, {
                    title: 'Finished',
                    columnIndex: 3,
                  })}
                </section>
              </div>
            </div>
            <div
              className="kanban-large-nav"
              aria-label="Large schedule navigation"
            >
              <div className="kanban-large-nav__slot kanban-large-nav__slot--previous">
                {activePane?.previous && (
                <button
                  key={`previous-${largePane}`}
                  type="button"
                  className={`kanban-large-nav__button kanban-large-nav__button--previous ${
                    largePaneHandlesSettling ? 'is-settling' : 'is-subtle'
                  }`}
                  onClick={() => navigateLargePane(activePane.previous)}
                  aria-label={`Show ${largePaneMeta[activePane.previous].label} lane`}
                >
                  <span className="kanban-large-nav__handle" aria-hidden="true">
                    <i className="pi pi-angle-left" />
                  </span>
                </button>
                )}
              </div>
              <div className="kanban-large-nav__slot kanban-large-nav__slot--next">
                {activePane?.next && (
                <button
                  key={`next-${largePane}`}
                  type="button"
                  className={`kanban-large-nav__button kanban-large-nav__button--next ${
                    largePaneHandlesSettling ? 'is-settling' : 'is-subtle'
                  }`}
                  onClick={() => navigateLargePane(activePane.next)}
                  aria-label={`Show ${largePaneMeta[activePane.next].label} lane`}
                >
                  <span className="kanban-large-nav__handle" aria-hidden="true">
                    <i className="pi pi-angle-right" />
                  </span>
                </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedFixture && showingDetails && (
          <KanbanDetailsPanel
            fixture={selectedFixture}
            mode={detailsMode}
            closePanel={closeDetailsPanel}
            moveToNextFixture={moveToNextFixture}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`kanban-view ${selectedFixture ? 'fixture-selected' : ''} ${showingDetails ? 'details-visible' : ''} ${isInlineMoveActive ? 'inline-move-mode' : ''}`}>
      <KanbanErrorMessage message={errorMessage} />
      <div className="kanban-board-area">
        {(() => {
          // Assuming 'queued' fixtures are identified by fixture.lane.current === 'queued'
          const queuedFixtures = prioritizeSelectedFixture(
            pitchFilteredFixtures.filter(f => f?.lane?.current === 'queued')
          );
          const plannedFixtures = sortFixturesForDisplay(
            pitchFilteredFixtures.filter((fixture) =>
              (isInlineMoveActive
                ? isMoveListFixture(fixture, selectedFixture?.id) &&
                  isCompatibleMoveFixture(selectedFixture, fixture)
                : getFixtureLane(fixture) === 'planned') &&
              (!isInlineMoveActive ||
                !isViewingInlineMoveTarget ||
                inlineMovePreviewIdSet.has(fixture.id))
            )
          );
          const startedFixtures = prioritizeSelectedFixture(
            pitchFilteredFixtures.filter(f => f?.lane?.current === 'started')
          );
          const finishedFixtures = sortFixturesForDisplay(
            pitchFilteredFixtures
              .filter(f => f?.lane?.current === 'finished')
              .sort((a, b) => {
                const dateA = a.ended ? new Date(a.ended) : 0;
                const dateB = b.ended ? new Date(b.ended) : 0;
                return dateB - dateA; // Sort descending, most recent first
              })
          );

          return (
            <>
              <div className="kanban-pitch-selector-area">
                <PitchSelector
                  pitches={availablePitches}
                  selectedPitch={boardPitch}
                  onSelectPitch={handleFocusedPitchSelect}
                  onSelectionCommit={handlePitchSelectionCommit}
                  pitchStatuses={pitchStatuses}
                  coordinatedPitches={pinnedPitches}
                />
              </div>

              {!isInlineMoveActive && (
                <>
                  {/* Columns are now direct children of kanban-board-area, ordered for grid placement */}
                  <KanbanColumn
                    key="queued"
                    columnKey="queued"
                    title="Up next"
                    columnIndex={0} // Logical index for 'queued'
                    fixtures={queuedFixtures}
                    onDrop={(e) => isCoordinatingBoardPitch && onDrop(e, 'queued')}
                    onDragOver={onDragOver}
                    onDragStart={isCoordinatingBoardPitch ? onDragStart : () => {}}
                    handleFixtureClick={handleFixtureClick}
                    selectedFixture={selectedFixture}
                    getPitchColor={getPitchColor} // Retained if still used by KanbanCard indirectly
                    allTournamentPitches={boardSlotPitches}
                    setMoveBarFixtureId={null}
                    recentlyMovedFixtureId={recentlyMovedFixtureId}
                    isInlineMoveMode={isInlineMoveActive}
                    inlineMoveFixtureId={selectedFixture?.id || null}
                    inlineMoveTargetPitch={activeMovePitch}
                    inlineMoveSwapFixtureId={inlineMove?.swapFixtureId || null}
                    onInlineMoveUp={() => moveInlineFixture(-1)}
                    onInlineMoveDown={() => moveInlineFixture(1)}
                    onInlineSwap={swapInlineFixture}
                    canInlineMoveUp={inlineMoveCurrentIndex > 0}
                    canInlineMoveDown={
                      inlineMoveCurrentIndex > -1 &&
                      inlineMoveCurrentIndex < (inlineMove?.previewOrderIds?.length || 0) - 1
                    }
                    inlineMoveSlackMinutes={inlineMoveSlackMinutes}
                    onAdjustInlineSlack={adjustInlineMoveSlack}
                    canAdjustInlineSlack={canAdjustInlineSlack}
                    renderFixtureActionRail={renderFixtureActionRail}
                    hideActionRail={!isCoordinatingBoardPitch || !selectedFixture}
                    // allPlannedFixtures might be needed if warning logic applies to "Next" column
                  />
                  <KanbanColumn
                    key="started"
                    columnKey="started"
                    title="Ongoing"
                    columnIndex={2} // Logical index for 'started'
                    fixtures={startedFixtures}
                    allPlannedFixtures={globalPlannedFixtures}
                    emptyMessage={activeMatchEmptyMessage}
                    onDrop={(e) => isCoordinatingBoardPitch && onDrop(e, 'started')}
                    onDragOver={onDragOver}
                    onDragStart={isCoordinatingBoardPitch ? onDragStart : () => {}}
                    handleFixtureClick={handleFixtureClick}
                    selectedFixture={selectedFixture}
                    getPitchColor={getPitchColor}
                    allTournamentPitches={boardSlotPitches}
                    setMoveBarFixtureId={null}
                    recentlyMovedFixtureId={recentlyMovedFixtureId}
                    isInlineMoveMode={isInlineMoveActive}
                    inlineMoveFixtureId={selectedFixture?.id || null}
                    inlineMoveTargetPitch={activeMovePitch}
                    inlineMoveSwapFixtureId={inlineMove?.swapFixtureId || null}
                    onInlineMoveUp={() => moveInlineFixture(-1)}
                    onInlineMoveDown={() => moveInlineFixture(1)}
                    onInlineSwap={swapInlineFixture}
                    canInlineMoveUp={inlineMoveCurrentIndex > 0}
                    canInlineMoveDown={
                      inlineMoveCurrentIndex > -1 &&
                      inlineMoveCurrentIndex < (inlineMove?.previewOrderIds?.length || 0) - 1
                    }
                    inlineMoveSlackMinutes={inlineMoveSlackMinutes}
                    onAdjustInlineSlack={adjustInlineMoveSlack}
                    canAdjustInlineSlack={canAdjustInlineSlack}
                    renderFixtureActionRail={renderFixtureActionRail}
                    hideActionRail={!isCoordinatingBoardPitch || !selectedFixture}
                  />

                  {showPitchCompleteBanner && (
                    <div className="pitch-complete-banner">
                      <div className="pitch-complete-banner__eyebrow">{boardPitch} complete</div>
                      <div className="pitch-complete-banner__headline">
                        This tired pitch has played its final match.
                      </div>
                      <div className="pitch-complete-banner__subtext">
                        Nothing left to queue or start. Let the grass recover.
                      </div>
                    </div>
                  )}
                </>
              )}

              <KanbanColumn
                key="planned"
                columnKey="planned"
                title={isInlineMoveActive ? 'Queued / Planned' : 'Planned'}
                columnIndex={1} // Logical index for 'planned'
                fixtures={plannedFixtures}
                onDrop={(e) => isCoordinatingBoardPitch && onDrop(e, 'planned')}
                onDragOver={onDragOver}
                onDragStart={isCoordinatingBoardPitch ? onDragStart : () => {}}
                handleFixtureClick={handleFixtureClick}
                selectedFixture={selectedFixture}
                getPitchColor={getPitchColor}
                allTournamentPitches={null} // Planned column does not use pitch-based slots
                setMoveBarFixtureId={null}
                recentlyMovedFixtureId={recentlyMovedFixtureId}
                isInlineMoveMode={isInlineMoveActive}
                inlineMoveFixtureId={selectedFixture?.id || null}
                inlineMoveTargetPitch={activeMovePitch}
                inlineMoveSwapFixtureId={inlineMove?.swapFixtureId || null}
                onInlineMoveUp={() => moveInlineFixture(-1)}
                onInlineMoveDown={() => moveInlineFixture(1)}
                onInlineSwap={swapInlineFixture}
                canInlineMoveUp={inlineMoveCurrentIndex > 0}
                canInlineMoveDown={
                  inlineMoveCurrentIndex > -1 &&
                  inlineMoveCurrentIndex < (inlineMove?.previewOrderIds?.length || 0) - 1
                }
                inlineMoveSlackMinutes={inlineMoveSlackMinutes}
                onAdjustInlineSlack={adjustInlineMoveSlack}
                canAdjustInlineSlack={canAdjustInlineSlack}
                renderFixtureActionRail={renderFixtureActionRail}
                hideActionRail={!isCoordinatingBoardPitch || !selectedFixture}
              />
              {!isInlineMoveActive && (
                <KanbanColumn
                  key="finished"
                  columnKey="finished"
                  title="Finished"
                  columnIndex={3} // Logical index for 'finished'
                  fixtures={finishedFixtures}
                  onDrop={(e) => isCoordinatingBoardPitch && onDrop(e, 'finished')}
                  onDragOver={onDragOver}
                  onDragStart={isCoordinatingBoardPitch ? onDragStart : () => {}}
                  handleFixtureClick={handleFixtureClick}
                  selectedFixture={selectedFixture}
                  getPitchColor={getPitchColor}
                  allTournamentPitches={null} // Finished column does not use pitch-based slots
                  setMoveBarFixtureId={null}
                  recentlyMovedFixtureId={recentlyMovedFixtureId}
                  isInlineMoveMode={isInlineMoveActive}
                  inlineMoveFixtureId={selectedFixture?.id || null}
                  inlineMoveTargetPitch={activeMovePitch}
                  inlineMoveSwapFixtureId={inlineMove?.swapFixtureId || null}
                  onInlineMoveUp={() => moveInlineFixture(-1)}
                  onInlineMoveDown={() => moveInlineFixture(1)}
                  onInlineSwap={swapInlineFixture}
                  canInlineMoveUp={inlineMoveCurrentIndex > 0}
                  canInlineMoveDown={
                    inlineMoveCurrentIndex > -1 &&
                    inlineMoveCurrentIndex < (inlineMove?.previewOrderIds?.length || 0) - 1
                  }
                  inlineMoveSlackMinutes={inlineMoveSlackMinutes}
                  onAdjustInlineSlack={adjustInlineMoveSlack}
                  canAdjustInlineSlack={canAdjustInlineSlack}
                  hideActionRail={!isCoordinatingBoardPitch || !selectedFixture}
                  renderFixtureActionRail={renderFixtureActionRail}
                />
              )}
            </>
          );
        })()}
      </div>

      {/* Show details panel when showingDetails is true */}
      {selectedFixture && showingDetails && (
        <KanbanDetailsPanel
          fixture={selectedFixture}
          mode={detailsMode}
          closePanel={closeDetailsPanel}
          moveToNextFixture={moveToNextFixture} // Pass moveToNextFixture
        />
      )}
    </div>
  );
};

export default Kanban;
