import { useFixtureContext } from '../FixturesContext';
import { useStartMatch } from '../PitchView.hooks'; // Re-using existing hook
import { useKanbanBoard } from './useKanbanBoard';
import KanbanColumn from './KanbanColumn';
import KanbanFilters from './KanbanFilters';
import KanbanDetailsPanel from './KanbanDetailsPanel';
import KanbanErrorMessage from './KanbanErrorMessage';
import './KanbanView.scss';

const KanbanView = () => {
  const { fixtures: initialFixtures, fetchFixtures, tournamentId, pitchId } = useFixtureContext();
  // Note: useStartMatch is specific to PitchView.hooks.jsx context.
  // It might need to be generalized or Kanban might need its own API interaction layer.
  // For now, we pass it as startMatchCallback.
  const startMatchOriginal = useStartMatch(tournamentId, pitchId, fetchFixtures);


  const {
    filteredFixtures,
    selectedFixture,
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

  return (
    <div className={`kanban-view ${selectedFixture ? 'details-visible' : ''}`}>
      <KanbanErrorMessage message={errorMessage} />
      <div className="kanban-board-area">
        {columns.map(column => (
          <KanbanColumn
            key={column}
            title={column}
            fixtures={filteredFixtures.filter(f => f.column === column)}
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
      <KanbanDetailsPanel fixture={selectedFixture} onClose={handleFixtureClick} />
    </div>
  );
};

export default KanbanView;
