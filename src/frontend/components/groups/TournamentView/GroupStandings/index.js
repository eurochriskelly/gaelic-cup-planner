import React from "react";

const GroupStandings = ({ group, standings }) => {
  let lastGroup = "";

  const GroupDivider = ({ team }) => {
    if (lastGroup !== team.grp) {
      lastGroup = team.grp;
      return (
        <tr key={team.id}>
          <td colSpan="9" className='groupHeader'>
            Group {team.grp}
          </td>
        </tr>
      );
    }
  };
  const NoData = () => <span className='noData'>-</span>;
  return (
    <>
      <table className='groupStandings'>
        <colgroup>
          <col width="46%" />
          <col width="12%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
        </colgroup>
        {
          // get unique groups from standings based on the group prop
          Object.keys(
            standings.reduce((acc, team) => {
              acc[team.grp] = true;
              return acc;
            }, {})
          ).map((grp, gi) => {
            const groupStandings = standings.filter((team) => +team.grp === +grp);
            return (
              <tbody key={`gs-${gi}`} className={gi % 2 === 0 ? 'even' : 'odd'}>
                {groupStandings
                  .filter((team) => team.category === group)
                  .map((team, si) => {
                    const {
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
                        {si ? null : <>
                          <GroupDivider key={`gd-${gi}`} team={team} />
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
                        </>
                        }
                        <tr key={`standing-row-${si}`}>
                          <td className='teamName'
                            style={{
                              fontWeight: finished ? "bold" : "normal",
                              color: finished ? "black" : "#666",
                            }}>{team.team}</td>
                          <td>
                            <span>{MatchesPlayed}</span>
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
            )
          })
        }
      </table>
    </>
  );
};

export default GroupStandings;
