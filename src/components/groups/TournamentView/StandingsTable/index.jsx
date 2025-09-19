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
    <table className="status-table" style={{ tableLayout: 'fixed', width: '100%' }}>
      <colgroup>
        <col style={{ width: "60%" }} />
        <col style={{ width: "10%", textAlign:'center' }} />
        <col style={{ width: "10%", textAlign:'center' }} />
        <col style={{ width: "10%", textAlign:'center' }} />
        <col style={{ width: "10%", textAlign:'center' }} />
      </colgroup>
      <thead>
        <tr>
          <th>Team</th>
          <th>MP</th>
          <th>W</th>
          <th>Pts</th>
          <th>Diff</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.team}>
            <td>{row.team}</td>
            <td>
              {typeof matchesToPlay === "number"
                ? `${valueOrDash(row.matchesPlayed)}/${matchesToPlay}`
                : valueOrDash(row.matchesPlayed)}
            </td>
            <td>{valueOrDash(row.won)}</td>
            <td>{valueOrDash(row.points)}</td>
            <td>{valueOrDash(row.scoreDifference)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StandingsTable;
