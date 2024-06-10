import { useState } from "react";

const MainCard = ({
  heading= '',
  id='0',
  icon='category',
  onSelect=() => {},
  children
}) => {
  const key = Math.random().toString(36).substring(7);
  return (
    <div key={`main-card-${key}`} className={`MainCard main-card ${icon}`} onClick={onSelect.bind(null, id)}>
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
