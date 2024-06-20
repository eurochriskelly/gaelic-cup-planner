import { useEffect, useState } from "react";
import { Calendar } from 'primereact/calendar';

export default TournamentInfo;

function TournamentInfo({ 
  tournamentId 
}) {
  const [tournInfo, setTournInfo] = useState({});
  const [date, setDate] = useState(null);
  const base = `/tournament/${tournamentId}`;

  useEffect(() => {
    fetch(`/api/tournaments/${tournamentId}`)
      .then((response) => response.json())
      .then((data) => setTournInfo(data.data))
      .catch((error) => console.error("Error fetching tournament info:", error));
  }, [tournamentId]);
  return (
    <>
      <h1 onClick={() => console.log(tournInfo)}>Pitch perfect</h1>
      <table>
        <tbody>
          <Row label="date">
              <Calendar value={tournInfo.Date?.substring(0, 10)} dateFormat='yy-mm-dd' onChange={(e) => setDate(e.value)} />
          </Row>
          <Row label="title">{tournInfo.Title}</Row>
          <Row label="location">{tournInfo.Location}</Row>
        </tbody>
      </table>
    </>
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
