import React, { useState } from "react";

const MainCard = ({
  heading= '',
  id='0',
  children
}) => {
  return (
    <div key={`main-card-${id}`}>
      <div>
        <h3>{heading}</h3>
      </div>
      <div>
        <div>{children}</div>
      </div>
    </div>
  )
};

export default MainCard;
