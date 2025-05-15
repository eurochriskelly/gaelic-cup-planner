import { useFixtureContext } from '../FixturesContext';
import { useStartMatch } from '../PitchView.hooks';
import { useKanbanBoard } from './useKanbanBoard';
import KanbanColumn from './KanbanColumn';
import KanbanFilters from './KanbanFilters';
import KanbanDetailsPanel from './KanbanDetailsPanel';
import KanbanErrorMessage from './KanbanErrorMessage';
import UpdateFixture from '../UpdateFixture';
import './KanbanView.scss';
import { useState } from 'react';

const KanbanView = () => {
  const { fixtures: initialFixtures, fetchFixtures, tournamentId, pitchId } = useFixtureContext();
  const startMatchOriginal = useStartMatch(tournamentId, pitchId, fetchFixtures);

  // New state to track if details panel should be shown
  const [showingDetails, setShowingDetails] = useState(false);

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
  } = useKanbanBoard(initialFixtures, fetchFixtures, startMatchOriginal);

  // Function to show full details panel
  const showDetailsPanel = () => {
    setShowingDetails(true);
  };

  // Function to close details panel
  const closeDetailsPanel = () => {
    setShowingDetails(false);
  };

  return (
    <div className={`kanban-view ${selectedFixture ? 'fixture-selected' : ''} ${showingDetails ? 'details-visible' : ''}`}>
      <KanbanErrorMessage message={errorMessage} />
      <div className="kanban-board-area">
        {columns.map((column, index) => (
          <KanbanColumn
            key={column}
            title={['Planned', 'Ongoing', 'Finished'][index]}
            columnIndex={index} // Pass the column index
            fixtures={filteredFixtures.filter(f => f?.lane?.current === column)}
            onDrop={(e) => onDrop(e, column)}
            onDragOver={onDragOver}
            onDragStart={onDragStart}
            handleFixtureClick={handleFixtureClick}
            selectedFixture={selectedFixture}
            getPitchColor={getPitchColor}
          />
        ))}
      </div>

      <KanbanFilters
        pitches={pitches}
        selectedPitch={selectedPitch}
        onPitchChange={handlePitchChange}
        teams={teams}
        selectedTeam={selectedTeam}
        onTeamChange={handleTeamChange}
      />

      {/* Always show update fixture when a fixture is selected */}
      {selectedFixture && (
        <div className="quick-action-panel">
          <UpdateFixture
            fixture={selectedFixture}
            showDetails={showDetailsPanel}
            closeDetails={closeDetailsPanel}
            isDetailsMode={showingDetails}
          />
        </div>
      )}

      {/* Show details panel when showingDetails is true */}
      {selectedFixture && showingDetails && (
        <KanbanDetailsPanel
          fixture={selectedFixture}
        />
      )}
    </div>
  );
};

export default KanbanView;
