import React, { useState } from "react";

const MainCard = ({
  heading= '',
  id='0',
  onSelect=() => {},
  children
}) => {
  const key = Math.random().toString(36).substring(7);
  return (
    <div key={`main-card-${key}`} className="main-card ex-deus" onClick={onSelect.bind(null, id)}>
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
