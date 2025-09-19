import { Children, useMemo, useState } from 'react';
import { useParams } from "react-router-dom";
import MainMenu from '../MainMenu';
import NavBar from '../NavBar';
import NavFooter from '../NavFooter';

import './MobileLayout.scss';

const MobileLayout = ({
  tabNames = [],
  onBack = null,
  active = 0,
  children,
}) => {
  const { pitchId } = useParams();
  const [selected, setSelected] = useState(tabNames[0] ?? null);
  const childrenArray = Children.toArray(children);
  const [headerContent, ...contentPanes] = childrenArray;

  const activeTab = useMemo(() => {
    if (!tabNames.length) return null;
    if (selected && tabNames.includes(selected)) return selected;
    return tabNames[0];
  }, [selected, tabNames]);

  const activeIndex = tabNames.length
    ? tabNames.findIndex((name) => name === activeTab)
    : 0;

  const fallbackBody = contentPanes.length ? contentPanes[0] : headerContent;
  const bodyContent = contentPanes[activeIndex >= 0 ? activeIndex : 0] ?? fallbackBody ?? null;
  const showTabs = tabNames.length > 1;

  return (
    <>
      <section className="MobileLayout mobile lovely">
        <header className="mobile-header">
          {typeof onBack === 'function' && (
            <button
              type="button"
              className="mobile-header__back pressable no-select"
              onClick={onBack}
              aria-label="Back"
            >
              ↩
            </button>
          )}
          <div className="mobile-header__content">
            {headerContent}
          </div>
          {showTabs && (
            <NavBar
              tabNames={tabNames}
              onSelect={setSelected}
              selected={activeTab}
            />
          )}
        </header>
        <section className="mobile-body" style={{ overflowY: 'auto' }}>
          {bodyContent}
        </section>
        <footer className="options">
          {pitchId && <MainMenu selected={active} />}
        </footer>
      </section>
      <NavFooter />
    </>
  );
};

export default MobileLayout;
