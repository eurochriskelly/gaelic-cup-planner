import { useState } from 'react';
import MainMenu from '../MainMenu';
import NavBar from '../NavBar';
import NavFooter from '../NavFooter';

import './MobileLayout.scss';

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
  return <> 
    <section className="MobileLayout mobile lovely">
      <header>
        <NavBar tabNames={tabNames} onSelect={handle.changetab} selected={selected} />
      </header>
      <section style={{overflowY: 'scroll'}}>{
        childrenArray.slice(1)[tabNames.indexOf(selected)]
      }</section>
    </section>
    <NavFooter />
  </> 
};

export default MobileLayout;
