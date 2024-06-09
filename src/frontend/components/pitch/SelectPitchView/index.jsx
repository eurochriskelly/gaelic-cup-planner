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

  async function fetchData() {
    fetch(`/api/tournaments/${tournamentId}/pitches`)
      .then((response) => response.json())
      .then((data) => {
        setPitchData(data.data);
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
                  <NextGameTitle match={matchId} started={startedTime} />
                  <div className="details">
                    <div className="time">{scheduledTime}</div>
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

function NextGameTitle({ started, match }) {
  const showMatchNumber = () => {
    let matchstr = "";
    if (match) {
      matchstr = `: fixture#${match}`;
    }
    return <i>{matchstr}</i>;
  };
  return (
    <div className={`play ${started ? "in-progress" : "next-up"}`}>
      {started ? (
        <span className="inProgress">In progress {showMatchNumber()}</span>
      ) : (
        <span className="nextUp">Next up {showMatchNumber()}</span>
      )}
    </div>
  );
}
