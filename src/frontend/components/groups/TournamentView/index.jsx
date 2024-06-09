import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import MobileLayout from "../../../shared/generic/MobileLayout";
import GroupStandings from "./GroupStandings";
import KnockoutTree from "./KnockoutTree";
import UpcomingFixtures from "./UpcomingFixtures";

const TournamentView = () => {
  // Application State
  const navigate = useNavigate();
  const { tournamentId, category } = useParams();
  const { mediaType, sections } = useAppContext();

  // Component State
  const tabNames = ["Upcoming", "Standings", "Knockout"];
  const [groups, setGroups] = useState([]);
  const [standings, setStandings] = useState([]);
  const [nextMatches, setNextMatches] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = () => {
    fetch(`/api/tournaments/${tournamentId}/fixtures/nextup`)
      .then((response) => response.json())
      .then((data) => setNextMatches(data.data.filter(x => x.category === category)))
      .catch((error) => {
        console.error("Error fetching next fixtures:", error);
      });

    fetch(`/api/tournaments/${tournamentId}/standings`)
      .then((response) => response.json())
      .then((data) => {
        if (!mediaType) setGroups([]);
        const g = data.groups.filter(
          (g) => g === (category || data.groups[0])
        )
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
    const intervalId = setInterval(fetchData, 4000);
    return () => clearInterval(intervalId);
  }, [tournamentId, mediaType, selectedCategory]);

  const handle = {
    back: () => {
      navigate(`/tournament/${tournamentId}/selectCategory`);
    },
  };

  const getCategories = (s = []) => {
    if (!s.length) return [];
    return s.reduce((acc, team) => {
      if (!acc.includes(team.category)) {
        acc.push(team.category);
      }
      return acc;
    }, []);
  };

  const changeCategory = (selected) => {
    setSelectedCategory(selected.value);
    fetchData();
  };
  return (
    <LayoutForPhone
      groups={groups}
      nextMatches={nextMatches}
      standings={standings}
      tabNames={tabNames}
      category={category}
      onBack={handle.back}
    />
  )
};

export default TournamentView;

function LayoutForPhone({
  groups,
  nextMatches,
  standings,
  category,
  onBack = () => {},
  tabNames,
}) {
  return (
    <MobileLayout
      sections={sections}
      onBack={onBack}
      active={1}
      tabNames={tabNames}
    >
      <span>
        <span></span>
        <span className="type-category">{category}</span>
      </span>
      <UpcomingFixtures groups={groups} nextMatches={nextMatches} />
      <article>
        {groups.map((group, id) => (
          <section key={`g${id}`}>
            <GroupStandings
              group={group}
              standings={standings.filter((team) => team.category === group)}
            />
          </section>
        ))}
      </article>
      <div><KnockoutTree /></div>
    </MobileLayout>
  );
}

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

