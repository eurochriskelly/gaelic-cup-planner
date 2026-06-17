import "./StandingsTable.scss";
import { getTeamAbbr, getTeamColors } from "../teamVisuals";

const valueOrDash = (value) => {
  return typeof value === "number" ? value : "-";
};

const getValue = (row, keys) => {
  const value = keys.find((key) => typeof row?.[key] === "number");
  return value ? row[value] : undefined;
};

const getTeamName = (row) => {
  return row?.team || row?.name || row?.teamName || "TBD";
};

const TeamBadge = ({ team }) => {
  const colors = getTeamColors(team);

  return (
    <span
      className="status-table__badge"
      style={{ backgroundColor: colors.bg, color: colors.text }}
      aria-hidden="true"
    >
      {getTeamAbbr(team)}
    </span>
  );
};

const StandingsTable = ({
  rows = [],
  emptyMessage = "No results yet.",
}) => {
  if (!rows?.length) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <table className="status-table">
      <thead>
        <tr>
          <th className="is-center">#</th>
          <th>Team</th>
          <th className="is-center">P</th>
          <th className="is-center">W</th>
          <th className="is-center">D</th>
          <th className="is-center">L</th>
          <th className="is-center">+/-</th>
          <th className="is-center">Pts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const team = getTeamName(row);
          const played = getValue(row, ["matchesPlayed", "played", "p", "mp"]);
          const won = getValue(row, ["won", "wins", "w"]);
          const drawn = getValue(row, ["drawn", "draws", "draw", "d"]);
          const lost = getValue(row, ["lost", "losses", "loss", "l"]);
          const diff = getValue(row, ["scoreDifference", "diff", "difference", "pointsDifference"]);
          const points = getValue(row, ["points", "pts"]);

          return (
            <tr key={`${team}-${index}`}>
              <td className="is-center is-pos">{index + 1}</td>
              <td className="status-table__team">
                <TeamBadge team={team} />
                <span>{team}</span>
              </td>
              <td className="is-center">{valueOrDash(played)}</td>
              <td className="is-center">{valueOrDash(won)}</td>
              <td className="is-center">{valueOrDash(drawn)}</td>
              <td className="is-center">{valueOrDash(lost)}</td>
              <td className={`is-center is-diff ${typeof diff === "number" && diff < 0 ? "is-negative" : ""}`}>
                {typeof diff === "number" && diff > 0 ? `+${diff}` : valueOrDash(diff)}
              </td>
              <td className="is-center is-points">{valueOrDash(points)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StandingsTable;
