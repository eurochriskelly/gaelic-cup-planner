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
      <div className="filter-group">
        <label htmlFor="pitchFilter">Filter by Pitch:</label>
        <select
          id="pitchFilter"
          value={selectedPitch}
          onChange={onPitchChange}
        >
          {pitches.map(pitch => (
            <option key={pitch} value={pitch}>{pitch}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="teamFilter">Filter by Team:</label>
        <select
          id="teamFilter"
          value={selectedTeam}
          onChange={onTeamChange}
        >
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default KanbanFilters;
