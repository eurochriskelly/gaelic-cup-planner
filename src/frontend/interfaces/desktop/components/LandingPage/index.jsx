import { useEffect, useState, useTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../shared/js/Provider";
import { useTranslation } from 'react-i18next';
import BigView from '../BigView';
import './LandingPage.scss';

const LandingPage = () => {
  console.log('Landing page ...')
  const { t } = useTranslation();
  const tt = code => t(`landingPage_${code}`);
  const navigate = useNavigate();
  const { tournamentId } = useAppContext();

  console.log('llll', tournamentId)
  const [tournInfo, setTournInfo] = useState({});
  const base = `/tournament/${tournamentId}`;

  useEffect(() => {
    fetch(base)
      .then((response) => response.json())
      .then((data) => setTournInfo(data.data))
      .catch((error) => console.error("Error fetching tournament info:", error));
  }, [tournamentId]);

  return (
    <main className={`.desktop LandingPage`}>
      <header>
        <h1 onClick={() => console.log(tournInfo)}>Pitch perfect desktop version</h1>
        <table>
          <tbody>
            <Row label="date">{tournInfo.Date?.substring(0, 10)}</Row>
            <Row label="title">{tournInfo.Title}</Row>
            <Row label="location">{tournInfo.Location}</Row>
          </tbody>
        </table>
      </header>
      <section>
        <BigView />
      </section>
    </main>
  );
};

export default LandingPage;

function Row({ label, children }) {
  return (
    <tr>
      <td>{label}</td>
      <td>{children}</td>
    </tr>
  );
}
