import { useState } from 'react';
import { useParams } from "react-router-dom";
import MainMenu from '../MainMenu';
import NavBar from '../NavBar';
import NavFooter from '../NavFooter';

import './MobileLayout.scss';

const MobileLayout = ({
  tabNames = [],
  children,
}) => {
  const { pitchId } = useParams();
  const [selected, setSelected] = useState(tabNames[0]);
  const handle = {
    changetab: (tab) => { setSelected(tab) }
  };

  const childrenArray = React.Children.toArray(children);
  const [SubHeading] = childrenArray;
  return <> 
    <section className="MobileLayout mobile lovely">
      <section style={{overflowY: 'scroll'}}>{
        childrenArray.slice(1)[tabNames.indexOf(selected)]
      }</section>
      <footer className="options">
        {pitchId && <MainMenu></MainMenu>}
      </footer>
    </section>
    <NavFooter />
  </> 
};

export default MobileLayout;
