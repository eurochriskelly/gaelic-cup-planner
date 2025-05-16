import { useState } from 'react';
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
      <div className="kanban-board-area">
        {columns.map((column, index) => (
          <KanbanColumn
            key={column}
            title={['Planned', 'Ongoing', 'Finished'][index]}
            columnIndex={index} // Pass the column index
            allTournamentPitches={index === 1 ? pitches : null} // Pass all pitches only to the "Ongoing" column
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


      {selectedFixture && (
        <div className="quick-action-panel">
          <UpdateFixture
            moveToNextFixture={moveToNextFixture}
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
