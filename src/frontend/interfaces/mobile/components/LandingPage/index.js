import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LandingPage = () => {
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
    }
  }

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
        <Card action={jump.competitions} title="Competitions">
          <p>View recent, ongoing and upcoming fixtures</p>
          <p>View group standings</p>
          <p>Follow progress in standings</p>
        </Card>
        <Card action={jump.scheduling} title="Scheduling">
          <p>Start matches, set scores, add card players</p>
        </Card>
      </section>
      {+tournamentId === 1 && (
        <section className='maintenance'>
          <h2>Maintenance</h2>
          <button onClick={handle.resetTournament}>Reset tournament</button>
        </section>
      )}
    </main>
  );
};

export default LandingPage;

function Card({ title, action, children }) {
  return (
    <button onClick={action} className="landing-card">
      <h1></h1>
      <div>
        <div className="title">{title}</div>
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
