import React, { useEffect, useState } from "react";
import SelectPitch from "./SelectPitch";
import styles from "./SelectPitchView.module.scss";

const SelectPitchView = () => {
  const [pitchData, setPitchData] = useState([]); // useState hook to store data

  async function fetchData() {
    console.log("Fetching data...");
    fetch("/api/pitches")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPitchData(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    // Define the API call here
    // Call the API when the component is mounted
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
              console.log("Pitche selected ");
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectPitchView;

