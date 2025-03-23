import { useState } from "react";
import NavFooter from "../NavFooter";

import "../MobileLayout/MobileLayout.scss";
import "./MobileSelect.scss";

const MobileSelect = ({
  onSelect = () => {},
  active=0,
  children,
}) => {
  const childrenArray = React.Children.toArray(children);
  const [SubHeading, ...cards] = childrenArray;
  const cardsPadded = cards.concat(Array(10 - cards.length).fill(null));
  return (
    <section className="MobileSelect mobile">
      <section style={{overflowY: 'scroll'}} id="cardArea">{
        cardsPadded?.map((x, i) => {
          return (
            <section key={`card_${i}`} className={`card ${x ? 'card-real div-shadow' : 'card-empty div-shadow-light'}`} onClick={onSelect.bind(null, i)}>
              {x}
            </section>
          );
        })
      }</section>
      <NavFooter /> 
    </section>
  );
};

export default MobileSelect;
