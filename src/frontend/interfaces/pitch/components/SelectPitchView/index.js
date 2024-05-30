import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SelectPitch from "./SelectPitch";

const SelectPitchView = () => {
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
  useEffect(() => { fetchData() }, []);

  return (
    <div className="container">
      <h1>Field Coordinator</h1>
      <h2>Please select pitch</h2>
      <div className="selectPitchView">
        {" "}
        {pitchData?.map((pitch) => (
          <SelectPitch
            key={pitch.pitch}
            {...pitch}
            onChoosePitch={() => {
              console.log("Pitch selected ");
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectPitchView;

