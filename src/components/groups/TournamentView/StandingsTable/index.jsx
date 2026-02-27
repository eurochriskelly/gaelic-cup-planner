import "./StandingsTable.scss";

const valueOrDash = (value) => {
  return typeof value === "number" ? value : "-";
};

const StandingsTable = ({
  rows = [],
  matchesToPlay,
  emptyMessage = "No results yet.",
}) => {
  if (!rows?.length) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <table className="status-table">
      <thead>
        <tr>
          <th className="is-center">Pos</th>
          <th>Team</th>
          <th className="is-center">MP</th>
          <th className="is-center">W</th>
          <th className="is-center">Pts</th>
          <th className="is-center">Diff</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.team || "team"}-${index}`}>
            <td className="is-center is-pos">{index + 1}</td>
            <td>{row.team}</td>
            <td className="is-center">
              {typeof matchesToPlay === "number"
                ? `${valueOrDash(row.matchesPlayed)}/${matchesToPlay}`
                : valueOrDash(row.matchesPlayed)}
            </td>
            <td className="is-center">{valueOrDash(row.won)}</td>
            <td className="is-center">{valueOrDash(row.points)}</td>
            <td className="is-center">{valueOrDash(row.scoreDifference)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StandingsTable;
