import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GroupStandings from "./GroupStandings";
import UpcomingFixtures from "./UpcomingFixtures";
import { getDivisions } from "../../../../shared/js/styler";

const TournamentView = () => {
  const { tournamentId } = useParams();

  const [groups, setGroups] = useState([]);
  const [standings, setStandings] = useState([]);
  const [nextMatches, setNextMatches] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch(`/api/fixtures/nextup/${tournamentId}`)
        .then((response) => response.json())
        .then((data) => {
          setNextMatches(data.data);
        })
        .catch((error) => {
          console.error("Error fetching next fixtures:", error);
        });

      fetch(`/api/group/standings/${tournamentId}`)
        .then((response) => response.json())
        .then((data) => {
          setGroups(data.groups);
          const newData = calculateMatchesPlayed(data.data);
          setStandings(addMatchesPlannedPerTeam(newData));
        })
        .catch((error) => {
          console.error("Error fetching standings", error);
        });
    };

    fetchData(); // Call it once immediately

    const intervalId = setInterval(fetchData, 20000); // Then set it to run every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [tournamentId]); 

  return (
    <div
      className='tournamentView'
      style={{
        gridTemplateRows: "1fr",
      }}
    >
      <article style={{ gridTemplateColumns: getDivisions(groups.length) }}>
        <h2>Standings</h2>
        {groups.map((group, id) => console.log(group) || (
          <section key={`g${id}`}>
            <GroupStandings
              group={group}
              standings={standings.filter((team) => team.category === group)}
            />
          </section>
        ))}
      </article>
    </div>
  );
};

export default TournamentView;

// FIXME: Find a better view that calculates these for us
function addMatchesPlannedPerTeam(data) {
  // Group teams by their 'grp' and 'category'
  const grouped = data.reduce((acc, item) => {
    const key = `${item.category}-${item.grp}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  // Calculate MatchesPlanned for each team in the group and add it to the team objects
  Object.values(grouped).forEach((group) => {
    const n = group.length - 1; // Each team plays against all other teams in the group
    group.forEach((team) => (team.MatchesPlanned = n));
  });

  return data;
}

function calculateMatchesPlayed(data) {
  data.forEach((team) => {
    // Calculate MatchesPlayed by summing Wins, Losses, and Draws
    team.MatchesPlayed = team.Wins + team.Losses + team.Draws;
  });

  return data;
}
