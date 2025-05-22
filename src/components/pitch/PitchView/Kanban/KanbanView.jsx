import { useState, useEffect } from 'react';
import { useFixtureContext } from '../FixturesContext';
import { useStartMatch } from '../PitchView.hooks';
import { useKanbanBoard } from './useKanbanBoard';
import KanbanColumn from './KanbanColumn';
import KanbanFilters from './KanbanFilters';
import KanbanDetailsPanel from './KanbanDetailsPanel';
import KanbanErrorMessage from './KanbanErrorMessage';
import UpdateFixture from '../UpdateFixture';
import './KanbanView.scss';

const KanbanView = ({
  moveToNextFixture,
}) => {
  const { fixtures: initialFixtures, fetchFixtures, tournamentId, pitchId } = useFixtureContext();
  const startMatchOriginal = useStartMatch(tournamentId, pitchId, fetchFixtures);

  // New state to track if details panel should be shown
  const [showingDetails, setShowingDetails] = useState(false);
  const [detailsMode, setDetailsMode] = useState('score'); // Default mode

  const {
    filteredFixtures,
    selectedFixture,
    setSelectedFixture,
    errorMessage,
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
    maximizedColumnKey, // New state from hook
    toggleMaximizeColumn, // New function from hook
  } = useKanbanBoard(initialFixtures, fetchFixtures, startMatchOriginal);

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


  // Function to show full details panel
  const showDetailsPanel = (mode = 'score') => {
    setDetailsMode(mode);
    setShowingDetails(true);
  };

  // Function to close details panel
  const closeDetailsPanel = () => {
    setShowingDetails(false);
    setDetailsMode('info'); // Reset mode to info
    // setSelectedFixture(null); // Consider if this is still needed or handled elsewhere
  };

  return (
    <div className={`kanban-view ${selectedFixture ? 'fixture-selected' : ''} ${showingDetails ? 'details-visible' : ''}`}>
      {!selectedFixture && (
        <KanbanFilters
          pitches={pitches}
          selectedPitch={selectedPitch}
          onPitchChange={handlePitchChange}
          teams={teams}
          selectedTeam={selectedTeam}
          onTeamChange={handleTeamChange}
        />
      )}
      <KanbanErrorMessage message={errorMessage} />
      <div className={`kanban-board-area ${
        maximizedColumnKey === 'planned' ? 'maximized-planned' :
        maximizedColumnKey === 'started' ? 'maximized-started' :
        maximizedColumnKey === 'finished' ? 'maximized-finished' : ''
      }`}>
        {(() => {
          const plannedFixtures = filteredFixtures.filter(f => f?.lane?.current === 'planned');
          const startedFixtures = filteredFixtures.filter(f => f?.lane?.current === 'started');
          const finishedFixtures = filteredFixtures
            .filter(f => f?.lane?.current === 'finished')
            .sort((a, b) => {
              const dateA = a.ended ? new Date(a.ended) : 0;
              const dateB = b.ended ? new Date(b.ended) : 0;
              return dateB - dateA; // Sort descending, most recent first
            });

          return (
            <>
              {/* Visual Column 1: Planned */}
              <div className="kanban-visual-column planned-column-container">
                <KanbanColumn
                  key="planned"
                  columnKey="planned"
                  title="Planned"
                  columnIndex={0} // Logical index for 'planned'
                  fixtures={plannedFixtures}
                  isCurrentlyMaximized={maximizedColumnKey === 'planned'}
                  onToggleMaximize={toggleMaximizeColumn}
                  onDrop={(e) => onDrop(e, 'planned')}
                  onDragOver={onDragOver}
                  onDragStart={onDragStart}
                  handleFixtureClick={handleFixtureClick}
                  selectedFixture={selectedFixture}
                  getPitchColor={getPitchColor}
                  allTournamentPitches={null}
                />
              </div>

              {/* Visual Column 2: Stacked Ongoing and Finished */}
              <div className="kanban-visual-column kanban-column-stacked stacked-column-container">
                <KanbanColumn
                  key="started"
                  columnKey="started"
                  title="Ongoing"
                  columnIndex={1} // Logical index for 'started'
                  fixtures={startedFixtures}
                  isCurrentlyMaximized={maximizedColumnKey === 'started'}
                  onToggleMaximize={toggleMaximizeColumn}
                  onDrop={(e) => onDrop(e, 'started')}
                  onDragOver={onDragOver}
                  onDragStart={onDragStart}
                  handleFixtureClick={handleFixtureClick}
                  selectedFixture={selectedFixture}
                  getPitchColor={getPitchColor}
                  allTournamentPitches={pitches} // Pass all pitches to the "Ongoing" column
                />
                <KanbanColumn
                  key="finished"
                  columnKey="finished"
                  title="Finished"
                  columnIndex={2} // Logical index for 'finished'
                  fixtures={finishedFixtures}
                  isCurrentlyMaximized={maximizedColumnKey === 'finished'}
                  onToggleMaximize={toggleMaximizeColumn}
                  onDrop={(e) => onDrop(e, 'finished')}
                  onDragOver={onDragOver}
                  onDragStart={onDragStart}
                  handleFixtureClick={handleFixtureClick}
                  selectedFixture={selectedFixture}
                  getPitchColor={getPitchColor}
                  allTournamentPitches={null}
                />
              </div>
            </>
          );
        })()}
      </div>

      {selectedFixture && (
        <UpdateFixture
          moveToNextFixture={moveToNextFixture}
          fixture={selectedFixture}
          showDetails={showDetailsPanel}
          closeDetails={closeDetailsPanel}
          isDetailsMode={showingDetails}
        />
      )}

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

export default KanbanView;
