import { useNavigate, useLocation, useParams } from "react-router-dom";
import HomeIcon from './../../icons/icon-home.svg?react';
import ScheduleIcon from './../../icons/icon-schedule.svg?react';
import StatusIcon from './../../icons/icon-status.svg?react';
import './NavFooter.scss';

export default NavFooter;

function NavFooter({ currentPath }) {
  const { pitchId, category, tournamentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const path = currentPath || window.location.pathname;

  const getIconClass = (route, match) => `nav-icon icon ${path.includes(route) ? 'active' : ''} ${match.includes(location.pathname) ? ' active': ' inactive'}`;

  return (
    <footer className="NavFooter h-36">
        <ScheduleIcon 
          className={getIconClass('selectPitch', [
            `/tournament/${tournamentId}/pitch`,
            `/tournament/${tournamentId}/pitch/${pitchId?.replace(/ /g, '%20')}`,
          ])}
          onClick={() => navigate(`/tournament/${tournamentId}/pitch/*`)}
        />
        <HomeIcon 
          className={getIconClass('LandingPage', [
            `/tournament/${tournamentId}` 
          ])}
          onClick={() => navigate(`/tournament/${tournamentId}`)}
        />
        <StatusIcon 
          className={getIconClass('selectCategory', [
            `/tournament/${tournamentId}/selectCategory`,
            `/tournament/${tournamentId}/category/${category?.replace(/ /g, '%20')}`,
          ])}
          onClick={() => navigate(`/tournament/${tournamentId}/selectCategory`)}
        />
    </footer>
  )
}
