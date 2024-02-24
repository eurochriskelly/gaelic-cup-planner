import React, { useState } from "react";
import styles from "./PitchViewHeader.module.scss";

const PitchViewHeader = ({ pitchId, tab = "Next", backToSelection, changeTab }) => {
  const tabNames = ["Next", "Finished", "Unplayed"];
  const [currentTab, setCurrentTab] = useState(tab);

  const tabSelected = tab => {
    setCurrentTab(tab)
    changeTab(tab)
  }
  return (
    <div className={styles.fixturesHead} style={{border: '2px solid red'}}>
      <h2 >
        <span onClick={backToSelection}></span>
        <span>Fixtures for pitch: {pitchId}</span>
      </h2>

      <div className={styles.navBar}>
        {tabNames.map((tn, i) => (
          <span
            key={`tn${i}`}
            onClick={tabSelected.bind(null, tn)}
            className={`tab-${tn} ${tn === currentTab ? styles.selected : ""}`}
          >
            {tn}
          </span>
        ))}{" "}
      </div>
    </div>
  );
};

export default PitchViewHeader;
