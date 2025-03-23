import './NavFooter.scss';
import HomeIcon from './../../icons/icon-home.svg?react';
import ScheduleIcon from './../../icons/icon-schedule.svg?react';
import StatusIcon from './../../icons/icon-status.svg?react';

export default NavFooter;

function NavFooter({
  
}) {
  return (
    <footer className="NavFooter h-36">
      <ScheduleIcon className="home-icon" />
      <HomeIcon className="home-icon" />
      <StatusIcon className="home-icon" />
    </footer>
  )
}
