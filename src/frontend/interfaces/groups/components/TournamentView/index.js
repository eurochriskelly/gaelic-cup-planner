import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CONF from '../../config.js';
import { useGroupContext } from "../../GroupProvider";
import GroupStandings from "./GroupStandings";
import UpcomingFixtures from "./UpcomingFixtures";
import CategorySelect from "./CategorySelect";
import { getDivisions } from "../../../../shared/js/styler";

const TournamentView = () => {
  const { tournamentId } = useParams();
  const [groups, setGroups] = useState([]);
  const [standings, setStandings] = useState([]);
  const [nextMatches, setNextMatches] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { mediaType } = useGroupContext();

  const fetchData = () => {
    fetch(`/api/fixtures/nextup/${tournamentId}`)
      .then((response) => response.json())
      .then((data) => setNextMatches(data.data))
      .catch((error) => {
        console.error("Error fetching next fixtures:", error);
      });

    fetch(`/api/group/standings/${tournamentId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!mediaType) setGroups([])
        const g = mediaType === 'phone'
          ? data.groups.filter(g => g === (selectedCategory || data.groups[0]))
          : data.groups
        setGroups(g);
        const newData = calculateMatchesPlayed(data.data);
        setStandings(addMatchesPlannedPerTeam(newData));
      })
      .catch((error) => {
        console.error("Error fetching standings", error);
      });
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, CONF.updateInterval);
    return () => clearInterval(intervalId);
  }, [tournamentId, mediaType, selectedCategory]);

  const getCategories = (s = []) => {
    if (!s.length) return [];
    return s.reduce((acc, team) => {
      if (!acc.includes(team.category)) {
        acc.push(team.category);
      }
      return acc;
    }, []);
  }

  const changeCategory = (selected) => {
    setSelectedCategory(selected.value);
    console.log('now fetching', selected.value);
    fetchData();
  } 

  return (
    <div className={`tournamentView ${mediaType === 'phone' ? 'media-phone' : ''}`}>
      <CategorySelect categories={getCategories(standings)} onSelect={changeCategory}  />
      <div>
        <UpcomingFixtures
          groups={groups}
          nextMatches={nextMatches}
        />

        <article style={{ gridTemplateColumns: getDivisions(groups.length) }}>
          <h2>Standings</h2>
          {groups.map(
            (group, id) => (
                <section key={`g${id}`}>
                  <GroupStandings
                    group={group}
                    standings={standings.filter(
                      (team) => team.category === group
                    )}
                  />
                </section>
              )
          )}
        </article>
      </div>
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
