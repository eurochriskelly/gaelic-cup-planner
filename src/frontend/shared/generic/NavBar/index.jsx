import { useState } from "react";

import "./NavBar.scss";

const NavBar = ({ 
  tabNames = [],
  onSelect,
  selected,
}) => {
  
  return (
    <div>
      <div className="navBar">
        {tabNames.map((tn, i) => (
          <span
            key={`tn${i}`}
            onClick={onSelect.bind(null, tn)}
            className={`tab-${tn} ${tn === selected ? "selected" : ""}`}
          >
            {tn}
          </span>
        ))}{" "}
      </div>
    </div>
  );
};

export default NavBar;
