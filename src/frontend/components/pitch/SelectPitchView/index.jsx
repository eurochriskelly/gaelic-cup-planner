import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import MobileSelect from "../../../shared/generic/MobileSelect";
import MainCard from "../../../shared/generic/MainCard";
import TeamNameDisplay from "../../../shared/generic/TeamNameDisplay/";
import './SelectPitchView.scss';

const SelectPitchView = () => {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const { sections } = useAppContext();
  const [pitchData, setPitchData] = useState([]);
  const [pitchFixtures, setPitchFixtures] = useState({});

  async function fetchData() {
    await fetch(`/api/tournaments/${tournamentId}/pitches`)
      .then((response) => response.json())
      .then((data) => {
        setPitchData(data.data);
        // Fetch all fixtures for the tournament
        fetch(`/api/tournaments/${tournamentId}/fixtures`)
          .then(res => res.json())
          .then(fixtureData => {
            const fixturesMap = fixtureData.data.reduce((acc, fixture) => {
              if (!acc[fixture.pitch]) acc[fixture.pitch] = [];
              acc[fixture.pitch].push(fixture);
              return acc;
            }, {});
            setPitchFixtures(fixturesMap);
          })
          .catch(error => console.error("Error fetching fixtures:", error));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handle = {
    select: (pitchId) => {
      const pitch = pitchData.find((t) => t.pitch === pitchId);
      navigate(`/tournament/${tournamentId}/pitch/${pitchId}`, {
        state: { pitch },
      });
    },
  };

  const getMatchProgress = (pitchInfo) => {
    const fixtures = pitchFixtures[pitchInfo.pitch] || [];
    const totalMatches = fixtures.length || 1; // Minimum 1 to avoid N/A
    const currentMatch = fixtures.findIndex(f => f.matchId === pitchInfo.matchId) + 1 || 1; // Default to 1 if not found
    return `(${currentMatch}/${totalMatches})`; // Always N/Y format
  };

  return (
    <MobileSelect sections={sections} active={1}>
      <div>Select pitch</div>
      {pitchData?.map((pitchInfo, id) => {
        const {
          matchId,
          pitch,
          startedTime,
          category,
          team1,
          team2,
          location,
          scheduledTime,
          type,
        } = pitchInfo;
        console.log('pi', pitchInfo)
        const midStr = `${matchId}`
        return (
          <MainCard
            id={pitch}
            key={`mc-${id}`}
            icon="pitch"
            heading={`${pitch}`}
            onSelect={handle.select}
          >
            <div className="SelectPitchView">
              {team1 && team2 ? (
                <>
                  <NextGameTitle match={matchId} started={startedTime} progress={getMatchProgress(pitchInfo)} />
                  <div className="details">
                    <div className="time">
                      <span className="clock-icon">🕒</span> {scheduledTime}
                    </div>
                    <div className="category">{category}</div>
                  </div>
                  <div className="teams">
                    <TeamNameDisplay number={1} team={team1} />
                    <div>vs</div>
                    <TeamNameDisplay number={2} team={team2} />
                  </div>
                </>
              ) : (
                <div className="no-more-games">No more scheduled matches on this pitch!</div>
              )}
            </div>
          </MainCard>
        );
      })}
    </MobileSelect>
  );
};

export default SelectPitchView;

function NextGameTitle({ started, match, progress }) {
  const midStr = `${match}`
  return (
    <div className={`play ${started ? "in-progress" : "next-up"}`}>
      <span className={`nxt-match ${started ? "inProgress" : "nextUp"}`}>
        <span>
          {started ? "In progress" : "Next up"}&nbsp;
          <b>{`#${midStr.slice(-3)}`}</b>
        </span>
        <span>{progress}</span>
      </span>
    </div>
  );
}
