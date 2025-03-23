import Cookies from "js-cookie";
import { useState, useEffect } from 'react';
import NavFooter from '../../../../shared/generic/NavFooter';
import ResetIcon from '../../../../shared/icons/icon-reset.svg?react';
import LogoutIcon from '../../../../shared/icons/icon-logout.svg?react';
import ScheduleIcon from '../../../../shared/icons/icon-schedule.svg?react';
import StatusIcon from '../../../../shared/icons/icon-status.svg?react';
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
    <main className={`mobile LandingPage${isScrolled ? ' shrink' : ''}`}>
      {/* New: Add banner container */}
      <div className="banner-container">
        <img src="/images/pitch-perfect.png" alt="Tournament Banner" className="banner-image" />
        <h1>
          <div className='version-info'>Pitch Perfect. V{versionInfo.mobile}</div>
          <div>{t('landingPage_heading')}</div>
        </h1>
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
      <section className="icon-grid">
        <div className="main-actions">
          <button className='icon-button' onClick={handle.disconnect}>
            <LogoutIcon className="icon" />
          </button>
        </div>
        {+tournamentId === 1 && (
          <div className="reset-action">
            <button className='icon-button' onClick={handleResetClick}>
              <ResetIcon className="icon" />
            </button>
          </div>
        )}
      </section>
      <NavFooter /> 
    </main>
  );
};



function Row({ label, children }) {
  return (
    <tr>
      <td>{label}</td>
      <td>{children}</td>
    </tr>
  );
}

export default LandingPage;
