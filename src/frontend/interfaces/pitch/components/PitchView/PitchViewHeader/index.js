import React, { useState } from "react";
import NavBar from '../../../../../shared/generic/NavBar';

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
      <NavBar tabNames={tabNames} onSelect={tabSelected} selected={currentTab} />
    </div>
  );
};

export default PitchViewHeader;
