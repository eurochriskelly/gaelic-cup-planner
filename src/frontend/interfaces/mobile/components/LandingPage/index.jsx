import Cookies from "js-cookie";
import { useState, useEffect } from 'react'; // Add useEffect
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../shared/js/Provider";
import { useTranslation } from 'react-i18next';
import { useFetchTournament } from './LandingPage.hooks';
import './LandingPage.scss';

const LandingPage = () => {
  const [isResetClicked, setIsResetClicked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // New: Track scroll state
  const { tournamentId } = useParams();
  const base = `/tournament/${tournamentId}`;
  const { tournInfo } = useFetchTournament(tournamentId);
  const { t } = useTranslation();
  const tt = code => t(`landingPage_${code}`);
  const { versionInfo } = useAppContext();
  const navigate = useNavigate();

  // New: Add scroll listener to toggle shrink class
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50); // Shrink after scrolling 50px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const jump = {
    competitions: () => navigate(`${base}/selectCategory`),
    scheduling: () => navigate(`${base}/selectPitch`),
  };

  const handle = {
    resetTournament: async () => {
      const button = document.querySelector('.sudo');
      button.classList.add('active');
      button.classList.remove('active');
      await fetch(`/api/tournaments/1/reset`);
    },
    disconnect: () => {
      Cookies.remove("tournamentId");
      navigate("/", { replace: true });
    }
  };

  const handleResetClick = async () => {
    setIsResetClicked(true);
    await handle.resetTournament();
    setTimeout(() => {
      setIsResetClicked(false);
    }, 200);
  };

  return (
    <main className={`.mobile LandingPage${isScrolled ? ' shrink' : ''}`}>
      {/* New: Add banner container */}
      <div className="banner-container">
        <img src="/images/pitch-perfect.png" alt="Tournament Banner" className="banner-image" />
        <h1>{t('landingPage_heading')}</h1> {/* Moved inside banner-container */}
      </div>
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
        <Card action={jump.scheduling} icon="⚡" title={tt('sched_exe')}>
          <p>{tt('StartMatches')}</p>
          <p>{tt('SetScores')}</p>
          <p>{tt('AddCardedPlayers')}</p>
        </Card>
        <Card action={jump.competitions} icon="🏐" title={tt('comp_status')}>
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

export default LandingPage;
