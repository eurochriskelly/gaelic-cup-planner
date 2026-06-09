import { Children } from "react";
import AuthenticatedBanner from "../AuthenticatedBanner";
import NavFooter from "../NavFooter";

import "../MobileLayout/MobileLayout.scss";
import "./MobileSelect.scss";

const MobileSelect = ({
  onSelect = () => {},
  active=0,
  className = '',
  banner,
  children,
}) => {
  const childrenArray = Children.toArray(children);
  const [SubHeading, ...cards] = childrenArray;

  return (
    <section className={`MobileSelect mobile ${banner ? 'MobileSelect--with-banner' : ''} ${className}`.trim()}>
      {banner ? (
        <AuthenticatedBanner {...banner} />
      ) : SubHeading ? (
        <header className="mobile-select-header">
          {SubHeading}
        </header>
      ) : null}
      <section id="cardArea">
        {cards?.map((x, i) => {
          if (!x) return null;

          const isPlaceholder = !!x.props?.['data-placeholder'];
          const isControl = !!x.props?.['data-control'];

          if (isPlaceholder) {
            return (
              <section
                key={`card_${i}`}
                className="card card-empty div-shadow"
                aria-hidden="true"
              >
                {x}
              </section>
            );
          }

          if (isControl) {
            return (
              <section
                key={`card_${i}`}
                className="mobile-select-control"
              >
                {x}
              </section>
            );
          }

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
