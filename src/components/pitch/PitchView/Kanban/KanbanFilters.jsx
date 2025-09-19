import './KanbanFilters.scss';

const KanbanFilters = ({
  pitches,
  selectedPitch,
  onPitchChange,
  teams,
  selectedTeam,
  onTeamChange,
}) => {
  return (
    <div className="kanban-filters">
      <div className="filter-group text-gray-400 mt-2 text-4xl uppercase"
           style={{ cursor: 'pointer', marginLeft: '-6.5rem' }}>
        <div>Touch fixture to view options</div>
      </div>
      {false && (
        <div className="filter-group">
          <label htmlFor="teamFilter">Filter by Team:</label>
          <select
            id="teamFilter"
            value={selectedTeam}
            onChange={onTeamChange}>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default KanbanFilters;
