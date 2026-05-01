import { useState, useEffect, useMemo } from 'react';
import { useFixtureContext } from '../FixturesContext';
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
  const startMatchOriginal = useStartMatch(tournamentId, pitchId, fetchFixtures);

   // New state to track if details panel should be shown
   const [showingDetails, setShowingDetails] = useState(false);
   const [detailsMode, setDetailsMode] = useState('score'); // Default mode
   const [recentlyMovedFixtureId, setRecentlyMovedFixtureId] = useState(null);
   const [inlineMove, setInlineMove] = useState(null);
   const [isInlineMoveSaving, setIsInlineMoveSaving] = useState(false);

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

  // Initialize focusedPitch
  useEffect(() => {
    if (!focusedPitch && availablePitches.length > 0) {
      setFocusedPitch(availablePitches[0]);
    } else if (focusedPitch && !availablePitches.includes(focusedPitch) && availablePitches.length > 0) {
       setFocusedPitch(availablePitches[0]);
    }
  }, [availablePitches, focusedPitch]);

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
  const isCoordinatingBoardPitch = !hasManagedPitchSelection || coordinatedPitchSet.has(boardPitch);
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
     if (!nextPitch) return;
     setFocusedPitch(nextPitch);
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
                  pitchStatuses={pitchStatuses}
                  coordinatedPitches={coordinatedPitches}
                />
              </div>

              {!isInlineMoveActive && (
                <>
                  {/* Columns are now direct children of kanban-board-area, ordered for grid placement */}
                  <KanbanColumn
                    key="queued"
                    columnKey="queued"
                    title="Queued"
                    columnIndex={0} // Logical index for 'queued'
                    fixtures={queuedFixtures}
                    onDrop={(e) => isCoordinatingBoardPitch && onDrop(e, 'queued')}
                    onDragOver={onDragOver}
                    onDragStart={isCoordinatingBoardPitch ? onDragStart : () => {}}
                    handleFixtureClick={handleFixtureClick}
                    selectedFixture={selectedFixture}
                    getPitchColor={getPitchColor} // Retained if still used by KanbanCard indirectly
                    allTournamentPitches={boardPitch ? [boardPitch] : []} // Only render slot for focused pitch
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
                    // allPlannedFixtures might be needed if warning logic applies to "Next" column
                  />
                  <KanbanColumn
                    key="started"
                    columnKey="started"
                    title="Ongoing"
                    columnIndex={2} // Logical index for 'started'
                    fixtures={startedFixtures}
                    allPlannedFixtures={globalPlannedFixtures}
                    onDrop={(e) => isCoordinatingBoardPitch && onDrop(e, 'started')}
                    onDragOver={onDragOver}
                    onDragStart={isCoordinatingBoardPitch ? onDragStart : () => {}}
                    handleFixtureClick={handleFixtureClick}
                    selectedFixture={selectedFixture}
                    getPitchColor={getPitchColor}
                    allTournamentPitches={boardPitch ? [boardPitch] : []} // Only render slot for focused pitch
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
                />
              )}
               
                {/* Action panel with buttons - positioned at row 4 */}
                <div className="kanban-action-panel">
                  {!isCoordinatingBoardPitch ? (
                    <div className="not-coordinating-pitch-banner">
                      <span>You are not coordinating this pitch</span>
                    </div>
                  ) : selectedFixture ? (
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
                    />
                  ) : (
                    <div className="no-fixture-selected-banner">
                      <span>TAP FIXTURE FOR OPTIONS</span>
                    </div>
                  )}
                </div>
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
