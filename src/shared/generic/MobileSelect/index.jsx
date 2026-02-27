import { Children } from "react";
import NavFooter from "../NavFooter";

import "../MobileLayout/MobileLayout.scss";
import "./MobileSelect.scss";

const MobileSelect = ({
  onSelect = () => {},
  active=0,
  children,
}) => {
  const childrenArray = Children.toArray(children);
  const [SubHeading, ...cards] = childrenArray;
  
  // Removed: const cardsPadded = cards.concat(Array(10 - cards.length).fill(null));
  // Reason: Responsive grid handles layout without needing empty placeholders.

  return (
    <section className="MobileSelect mobile">
      {SubHeading ? (
        <header className="mobile-select-header">
          {SubHeading}
        </header>
      ) : null}
      <section id="cardArea">
        {cards?.map((x, i) => {
          if (!x) return null;
          return (
            <section 
              key={`card_${i}`} 
              className="card div-shadow" 
              onClick={onSelect.bind(null, i)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') onSelect(i); }}
            >
              {x}
            </section>
          );
        })}
      </section>
      <NavFooter /> 
    </section>
  );
};

export default MobileSelect;