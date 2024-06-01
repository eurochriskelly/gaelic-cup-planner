import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "../../../shared/js/Provider";
import MobileLayout from "../../../shared/generic/MobileLayout";
import NavBar from "../../../shared/generic/NavBar";
import GroupStandings from "./GroupStandings";
import UpcomingFixtures from "./UpcomingFixtures";
import CategorySelect from "./CategorySelect";
import { getDivisions } from "../../../shared/js/styler";
import { sections } from "../../../../../config/config";

const TournamentView = () => {
  // Application State
  const navigate = useNavigate();
  const { tournamentId, category } = useParams();
  const { mediaType } = useContext();

  // Component State
  const tabNames = ["Upcoming", "Standings", "Knockout"];
  const [currentSection, setCurrentSection] = useState(sections[0]);
  const [groups, setGroups] = useState([]);
  const [standings, setStandings] = useState([]);
  const [nextMatches, setNextMatches] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = () => {
    fetch(`/api/tournaments/${tournamentId}/fixtures/nextup`)
      .then((response) => response.json())
      .then((data) => console.log("nextup", data) || setNextMatches(data.data))
      .catch((error) => {
        console.error("Error fetching next fixtures:", error);
      });

    fetch(`/api/tournaments/${tournamentId}/standings`)
      .then((response) => response.json())
      .then((data) => {
        if (!mediaType) setGroups([]);
        const g =
          mediaType === "phone"
            ? data.groups.filter(
                (g) => g === (selectedCategory || data.groups[0])
              )
            : data.groups;
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
  const selectTab = (tab) => {
    setCurrentSection(tab);
  };
  const isPhone = mediaType === "phone";
  return isPhone ? (
    <LayoutForPhone
      groups={groups}
      nextMatches={nextMatches}
      standings={standings}
      tabNames={tabNames}
      category={category}
      onBack={handle.back}
    />
  ) : (
    <>
      <CategorySelect
        categories={getCategories(standings)}
        onSelect={changeCategory}
      />
      <NavBar
        tabNames={tabNames}
        onSelect={selectTab}
        selected={currentSection}
      />
      <LayoutForDesktop
        groups={groups}
        nextMatches={nextMatches}
        standings={standings}
      />
    </>
  );
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
      <div>TBD. knockouts!</div>
    </MobileLayout>
  );
}

function LayoutForDesktop({ groups, nextMatches, standings, isPhone }) {
  return (
    <div className={`tournamentView media-desktop`}>
      <div>
        <UpcomingFixtures
          isPhone={isPhone}
          groups={groups}
          nextMatches={nextMatches}
        />
        <article style={{ gridTemplateColumns: getDivisions(groups.length) }}>
          <h2>Standings</h2>
          {groups.map((group, id) => (
            <section key={`g${id}`}>
              <GroupStandings
                group={group}
                standings={standings.filter((team) => team.category === group)}
              />
            </section>
          ))}
        </article>
      </div>
    </div>
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

