import React, { useEffect, useState } from "react";
import SelectPitch from "./SelectPitch";
import styles from "./SelectPitchView.module.scss";


const SelectPitchView = () => {
  const [pitchData, setPitchData] = useState([]); // useState hook to store data

  async function fetchData() {
    fetch("/api/pitches")
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
    <div className={styles.container}>
      <h2>Please select pitch</h2>
      <div className={styles.selectPitchView}>
        {" "}
        {pitchData.map((pitch) => (
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

