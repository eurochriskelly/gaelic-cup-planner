import React, { useState } from 'react';
import MainMenu from '../MainMenu';
import NavBar from '../NavBar';

import './MobileLayout.css';

const MobileLayout = ({
  onBack = () => {},
  active=0,
  tabNames = [],
  children,
}) => {
  const [selected, setSelected] = useState(tabNames[0]);
  const handle = {
    changetab: (tab) => { setSelected(tab) }
  };

  const childrenArray = React.Children.toArray(children);
  const [SubHeading] = childrenArray;
  return (
    <section className="MobileLayout mobile">
      <header>
        <MainMenu selected={active} />
        <h2 >
          <span onClick={onBack} className='pressable no-select'>&#x21A9;</span>
          <span>{SubHeading}</span>
        </h2>
        <NavBar tabNames={tabNames} onSelect={handle.changetab} selected={selected} />
      </header>
      <section>{childrenArray.slice(1)[tabNames.indexOf(selected)]}</section>
    </section>
  )
};

export default MobileLayout;
