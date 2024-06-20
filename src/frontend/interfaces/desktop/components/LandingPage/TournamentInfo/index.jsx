import React, { useEffect, useState } from "react";

export default TournamentInfo;

function TournamentInfo({ 
  tournamentId 
}) {
  const [tournInfo, setTournInfo] = useState({});
  const base = `/tournament/${tournamentId}`;

  useEffect(() => {
    fetch(base)
      .then((response) => response.json())
      .then((data) => setTournInfo(data.data))
      .catch((error) => console.error("Error fetching tournament info:", error));
  }, [tournamentId]);
  return (
    <>
        <h1 onClick={() => console.log(tournInfo)}>Pitch perfect desktop version</h1>
        <table>
          <tbody>
            <Row label="date">{tournInfo.Date?.substring(0, 10)}</Row>
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
