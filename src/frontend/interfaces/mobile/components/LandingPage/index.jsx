import Cookies from "js-cookie";
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../shared/js/Provider";
import { useTranslation } from 'react-i18next';
import { useFetchTournament } from './LandingPage.hooks';
import PinLogin from '../../../../shared/generic/PinLogin';
import './LandingPage.scss';

const LandingPage = () => {
  console.log('do we have what we need?');

  const [isResetClicked, setIsResetClicked] = useState(false);
  let { tournamentId } = useParams();
  if (!tournamentId) tournamentId = Cookies.get('tournamentId');
  if (!tournamentId || tournamentId === 'undefined') {
    return <PinLogin />
  } 
  const base = `/tournament/${tournamentId}`;
  const { tournInfo }  = useFetchTournament(tournamentId);
  const { t } = useTranslation();
  const tt = code => t(`landingPage_${code}`);
  const { versionInfo } = useAppContext();
  const navigate = useNavigate();
  const jump = {
    competitions: () => navigate(`${base}/selectCategory`),
    scheduling: () => navigate(`${base}/selectPitch`),
  };

  const handle = {
    resetTournament: async () => {
      const button = document.querySelector('.sudo');
      button.classList.add('active'); // Add active class for animation
    button.classList.remove('active'); // Remove active class after fetch
      await fetch(`/api/tournaments/1/reset`);
    },
    disconnect: () => {
      Cookies.remove('tournamentId');
      navigate("/");
    }
  };

  const handleResetClick = async () => {
     setIsResetClicked(true);
     await handle.resetTournament();
     setTimeout(() => {
       setIsResetClicked(false);
     }, 200); // Matches transition duration
  };

  return (
    <main className={`.mobile LandingPage`}>
      <h1>{t('landingPage_heading')}</h1>
      <header>
        <table>
          <tbody>
            <Row label="date">{tournInfo.Date?.substring(0, 10)}</Row>
            <Row label="title">{tournInfo.Title}</Row>
            <Row label="location">{tournInfo.Location}</Row>
          </tbody>
        </table>
      </header>
      <section>
        <Card
          action={jump.scheduling}
          icon="&#x26A1;"
          title={tt('sched_exe')} >
          <p>{tt('StartMatches')}</p>
          <p>{tt('SetScores')}</p>
          <p>{tt('AddCardedPlayers')}</p>
        </Card>
        <Card
          action={jump.competitions}
          icon="&#x1F3D0;"
          title={tt('comp_status')} >
          <p>{tt('ViewRecent')}</p>
          <p>{tt('ViewGroupStandings')}</p>
          <p>{tt('FollowProgressInStandings')}</p>
        </Card>
      </section>
      <section className="maintenance">
        {+tournamentId === 1 && (
             <button className='sudo' onClick={handleResetClick}>{tt('ResetTournament')}</button>
        )}
        <button onClick={handle.disconnect}>{tt('Disconnect')}</button>
      </section>
      <footer>Pitch Perfect. V{versionInfo.mobile}</footer>
    </main>
  );
};

export default LandingPage;

function Card({ title, icon, action, children }) {
  return (
    <button onClick={action} className="landing-card">
      <div>
        <div className="title">
          {icon} {title}
        </div>
        <div>
          <div>{children}</div>
        </div>
      </div>
    </button>
  );
}

function Row({ label, children }) {
  return (
    <tr>
      <td>{label}</td>
      <td>{children}</td>
    </tr>
  );
}


