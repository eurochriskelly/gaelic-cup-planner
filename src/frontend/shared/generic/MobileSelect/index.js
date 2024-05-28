import React, { useState } from "react";
import MainMenu from "../MainMenu";

import "../MobileLayout/MobileLayout.css";
import "./MobileSelect.css";

const MobileSelect = ({
  title = "Please set",
  onSelect = () => {},
  sections = [],
  children,
}) => {
  const childrenArray = React.Children.toArray(children);
  const [SubHeading, ...cards] = childrenArray;
  const cardsPadded = cards.concat(Array(8 - cards.length).fill(null));
  // Output: [1, 2, 3, 4, null, null, null, null]
  return (
    <section className="MobileSelect mobile">
      <header>
        <MainMenu sections={sections} />
        <h2>
          <span>&nbsp;</span>
          <span>{SubHeading}</span>
        </h2>
      </header>
      <section id="cardArea">{
        cardsPadded?.map((x, i) => {
          return (
            <section key={`card_${i}`} className={`div-shadow card ${x ? 'card-real' : 'card-empty'}`} onClick={onSelect.bind(null, i)}>
              {x}
            </section>
          );
        })
      }</section>
    </section>
  );
};

export default MobileSelect;
