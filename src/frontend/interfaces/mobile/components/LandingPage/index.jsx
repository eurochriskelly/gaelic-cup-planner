import { useEffect, useState, useTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../shared/js/Provider";
import { useTranslation } from 'react-i18next';
import './LandingPage.scss';

const LandingPage = () => {
  const { t } = useTranslation();
  const tt = code => t(`landingPage_${code}`);
  const { versionInfo } = useAppContext();
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const [tournInfo, setTournInfo] = useState({});
  const base = `/tournament/${tournamentId}`;
  const jump = {
    competitions: () => navigate(`${base}/selectCategory`),
    scheduling: () => navigate(`${base}/selectPitch`),
  };

  useEffect(() => {
    fetch(`/api/tournaments/${tournamentId}`)
      .then((response) => response.json())
      .then((data) => setTournInfo(data.data))
      .catch((error) => {
        console.error("Error fetching tournament info:", error);
      });
  }, []);

  const handle = {
    resetTournament: () => fetch(`/api/tournaments/1/reset`),
    disconnect: () => navigate("/"),
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
          <button className='sudo' onClick={handle.resetTournament}>{tt('ResetTournament')}</button>
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
