import { useState, useEffect } from 'react';

export const useFetchTournament = (tid) => {
  const [tournInfo, setTournInfo] = useState({});
  useEffect(() => {
    fetch(`/api/tournaments/${tid}`)
      .then((response) => response.json())
      .then((data) => setTournInfo(data.data))
      .catch((error) => {
        console.error("Error fetching tournament info:", error);
      });
  }, []);

  return { tournInfo }
}
