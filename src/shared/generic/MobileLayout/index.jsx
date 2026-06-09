import { useState } from 'react';
import AuthenticatedBanner from '../AuthenticatedBanner';
import NavFooter from '../NavFooter';

import './MobileLayout.scss';

const MobileLayout = ({
  tabNames = [],
  banner,
  children,
}) => {
  const [selected, setSelected] = useState(tabNames[0]);

  const childrenArray = React.Children.toArray(children);
  return <>
    <section className={`MobileLayout mobile${banner ? ' MobileLayout--with-banner' : ''}`}>
      {banner && <AuthenticatedBanner {...banner} />}
      <section className="MobileLayout__content">{
        childrenArray.slice(1)[tabNames.indexOf(selected)]
      }</section>
    </section>
    <NavFooter />
  </>
};

export default MobileLayout;
