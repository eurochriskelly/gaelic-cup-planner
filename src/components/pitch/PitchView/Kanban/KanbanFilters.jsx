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
