import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GroupStandings from "./GroupStandings";
import UpcomingFixtures from "./UpcomingFixtures";
import { getDivisions } from '../../../../shared/js/styler';
import styles from "./TournamentView.module.scss";

const TournamentView = () => {
  console.log("TournamentView is starting");
  const { tournamentId } = useParams();

  const [groups, setGroups] = useState([]);
  const [standings, setStandings] = useState([]);
  const [nextMatches, setNextMatches] = useState([]);
  // const [tournament, setTournament] = useState({})

  useEffect(() => {
    // setTournament(location.state.tournament)
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
        setStandings(data.data);
      })
      .catch((error) => {
        console.error("Error fetching standings", error);
      });
  }, []);
  return (
    <div className={styles.tournamentView}>
      <UpcomingFixtures
        styles={styles}
        groups={groups}
        nextMatches={nextMatches}
      />
      <article style={{gridTemplateColumns: getDivisions(groups.length)}}>
        <h2>Standings</h2>
        {groups.map((group, id) => {
          return (
            <section key={`g${id}`}>
              <GroupStandings
                standings={standings.filter((team) => team.category === group)}
              />
            </section>
          );
        })}
      </article>
    </div>
  );
};

export default TournamentView;

