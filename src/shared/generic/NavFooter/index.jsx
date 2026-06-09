import { useNavigate, useLocation, useParams } from "react-router-dom";
import HomeIcon from './../../icons/icon-home.svg?react';
import ScheduleIcon from './../../icons/icon-schedule.svg?react';
import StatusIcon from './../../icons/icon-status.svg?react';
import { useFixtureContext } from "./../../../components/pitch/PitchView/FixturesContext";
import { choosePreferredPitch } from "../../js/pitchSelection";
import { useAppContext } from "../../js/Provider";
import './NavFooter.scss';

export default NavFooter;

function NavFooter({ currentPath }) {
  const { pitchId, category, tournamentId } = useParams();
  const { filterSelections } = useAppContext();
  let fetchFixtures = () => {};
  const FC = useFixtureContext();
  if (FC) {
    fetchFixtures = FC.fetchFixtures;
  }
  const navigate = useNavigate();
  const location = useLocation();
  const path = currentPath || window.location.pathname;

  const getIconClass = (route, match) => `nav-icon icon ${path.includes(route) ? 'active' : ''} ${match.includes(location.pathname) ? ' active': ' inactive'}`;

  return (
    <footer className="NavFooter h-36">
      <HomeIcon
        className={getIconClass('home', [
          `/tournament/${tournamentId}/home`
        ])}
        onClick={() => navigate(`/tournament/${tournamentId}/home`)}
      />
      <ScheduleIcon
        className={getIconClass('pitch', [
          `/tournament/${tournamentId}/pitch`,
          `/tournament/${tournamentId}/pitch/${pitchId?.replace(/ /g, '%20')}`,
        ])}
        onClick={async () => {
          await fetchFixtures();
          const preferredPitch = choosePreferredPitch({ filterSelections });
          navigate(`/tournament/${tournamentId}/pitch/${preferredPitch || '*'}`)
        }}
      />
      <StatusIcon
        className={getIconClass('category', [
          `/tournament/${tournamentId}/category`,
          `/tournament/${tournamentId}/category/${category?.replace(/ /g, '%20')}`,
        ])}
        onClick={() => navigate(`/tournament/${tournamentId}/category`)}
      />
    </footer>
  )
}
