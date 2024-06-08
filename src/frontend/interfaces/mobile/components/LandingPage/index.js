import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "../../../../shared/js/Provider";
import { disconnect } from "process";

const LandingPage = () => {
  const { versionInfo } = useContext();
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
    resetTournament: () => {
      fetch(`/api/tournaments/1/reset`);
    },
    disconnect: () => {
      navigate("/");
    },
  };

  return (
    <main className={`.mobile LandingPage`}>
      <h1>Tournament information</h1>
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
          title="Schedule Execution" >
          <p>Start matches</p>
          <p>set scores</p>
          <p>add card players</p>
        </Card>
        <Card
          action={jump.competitions}
          icon="&#x1F3D0;"
          title="Competition Status" >
          <p>View recent, ongoing and upcoming fixtures</p>
          <p>View group standings</p>
          <p>Follow progress in standings</p>
        </Card>
      </section>
      <section className="maintenance">
        {+tournamentId === 1 && (
          <button className='sudo' onClick={handle.resetTournament}>Reset tournament</button>
        )}
        <button onClick={handle.disconnect}>Disconnect</button>
      </section>
      <footer>GaelicGale Mobile. V{versionInfo.mobile}</footer>
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
