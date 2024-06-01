import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MobileSelect from "../../../shared/generic/MobileSelect";
import MainCard from "../../../shared/generic/MainCard";
import { sections } from "../../../../../config/config";
import TeamNameDisplay from "../../../shared/generic/TeamNameDisplay/";

const SelectPitchView = () => {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
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
    <MobileSelect sections={sections} selected={1}>
      <div>Field Coordinator</div>
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
    <div className="play">
      {started ? (
        <span className="inProgress">In progress {showMatchNumber()}</span>
      ) : (
        <span className="nextUp">Next up {showMatchNumber()}</span>
      )}
    </div>
  );
}
