import React from "react";

const GroupStandings = ({ group, standings }) => {
  let lastGroup = "";

  const GroupDivider = ({ team }) => {
    if (lastGroup !== team.grp) {
      lastGroup = team.grp;
      return (
        <tr key={team.id}>
          <td colSpan="9" className='groupHeader'>
            {team.category} / Group {team.grp}
          </td>
        </tr>
      );
    }
  };
  const NoData = () => <span className='noData'>-</span>;
  return (
    <>
      <table className='groupStandings'>
        <thead>
          <tr>
            <th>Team</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>PF</th>
            <th>PD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, si) => {
            const {
              id,
              MatchesPlayed,
              MatchesPlanned,
              Wins,
              Draws,
              Losses,
              PointsFrom,
              PointsDifference,
              TotalPoints,
            } = team;
            const mp = MatchesPlayed;
            const finished = mp === MatchesPlanned;
            return (
              <>
                {lastGroup !== team.group && <GroupDivider key={`gd-${si}`} team={team} />}
                <tr key={`standing-row-${id}`}>
                  <td
                    className='teamName'
                    style={{
                      fontWeight: finished ? "bold" : "normal",
                      color: finished ? "black" : "grey",
                    }}
                  >
                    {team.team}
                  </td>
                  <td>
                    {MatchesPlayed}
                    <span className='lessRelevant'>/{MatchesPlanned}</span>
                  </td>
                  <td>{mp ? Wins : <NoData />}</td>
                  <td>{mp ? Draws : <NoData />}</td>
                  <td>{mp ? Losses : <NoData />}</td>
                  <td>{mp ? PointsFrom : <NoData />}</td>
                  <td>{mp ? PointsDifference : <NoData />}</td>
                  <td>
                    {mp ? (
                      <div className='total'>{TotalPoints}</div>
                    ) : (
                      <NoData />
                    )}
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default GroupStandings;
