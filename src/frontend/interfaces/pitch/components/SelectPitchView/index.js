import React, { useEffect, useState } from "react";
import SelectPitch from "./SelectPitch";

const SelectPitchView = () => {
  const [pitchData, setPitchData] = useState([]); // useState hook to store data

  async function fetchData() {
    fetch("/api/tournament/7/pitches")
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

  return (
    <div className="container">
      <h1>Field Coordinator</h1>
      <h2>Please select pitch</h2>
      <div className="selectPitchView">
        {" "}
        {pitchData.map((pitch) => console.log(pitch) || (
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

