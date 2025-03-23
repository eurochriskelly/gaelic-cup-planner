import './NavFooter.scss';
import HomeIcon from './../../icons/icon-home.svg?react';
import ScheduleIcon from './../../icons/icon-schedule.svg?react';
import StatusIcon from './../../icons/icon-status.svg?react';

export default NavFooter;

function NavFooter({ currentPath }) {
  const navigate = useNavigate();
  const path = currentPath || window.location.pathname;

  const getIconClass = (route) => 
    `nav-icon ${path.includes(route) ? 'active' : ''}`;

  return (
    <footer className="NavFooter h-36">
      <ScheduleIcon 
        className={getIconClass('selectPitch')}
        onClick={() => navigate('selectPitch')}
      />
      <HomeIcon 
        className={getIconClass('LandingPage')}
        onClick={() => navigate('')}
      />
      <StatusIcon 
        className={getIconClass('selectCategory')}
        onClick={() => navigate('selectCategory')}
      />
    </footer>
  )
}
