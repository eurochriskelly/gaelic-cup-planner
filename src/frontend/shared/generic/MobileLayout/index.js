import React, { useState } from 'react';
import MainMenu from '../MainMenu';
import NavBar from '../NavBar';

import './MobileLayout.css';

const MobileLayout = ({
  title = 'Please set',
  toplevel = false,
  onBack = () => {},
  sections = [],
  tabNames = ['ab', 'bc', 'cd'],
  children,
}) => {
  const [selected, setSelected] = useState(tabNames[0]);
  const handle = {
    hamburger: () => console.log('hamburger handle'),
    changetab: (tab) => {
      console.log('changing tab to', tab)
      setSelected(tab)
    }
  };

  const childrenArray = React.Children.toArray(children);
  const [SubHeading] = childrenArray;
  return (
    <section className="MobileLayout mobile">
      <header>
        <MainMenu sections={sections} />
        <h2 >
          <span onClick={onBack} className='pressable no-select'>&#x21A9;</span>
          <span>{SubHeading}</span>
        </h2>
        <NavBar tabNames={tabNames} onSelect={handle.changetab} selected={selected} />
      </header>
      <article>{childrenArray.slice(1)[tabNames.indexOf(selected)]}</article>
    </section>
  )
};

export default MobileLayout;
