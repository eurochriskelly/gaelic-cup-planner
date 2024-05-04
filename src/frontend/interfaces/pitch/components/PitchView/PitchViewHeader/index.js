import React, { useState } from "react";

const PitchViewHeader = ({
  pitchId,
  tab = "Next",
  backToSelection,
  changeTab,
}) => {
  const tabNames = ["Next", "Finished", "Unplayed"];
  const [currentTab, setCurrentTab] = useState(tab);

  const tabSelected = (tab) => {
    setCurrentTab(tab);
    changeTab(tab);
  };
  return (
    <div className='fixturesHead'>
      <h2>
        <span onClick={backToSelection}>&larr;</span>
        <span>Fixtures for pitch: {pitchId}</span>
      </h2>

      <div className='navBar'>
        {tabNames.map((tn, i) => (
          <span
            key={`tn${i}`}
            onClick={tabSelected.bind(null, tn)}
            className={`tab-${tn} ${tn === currentTab ? 'selected' : ""}`}
          >
            {tn}
          </span>
        ))}{" "}
      </div>
    </div>
  );
};

export default PitchViewHeader;
