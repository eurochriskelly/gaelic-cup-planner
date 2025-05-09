import { useState, useEffect } from 'react';
const defaultDate = {
  Date: '2028-01-01T00:00:00Z'
}

export const useFetchTournament = (tid) => {
  const [tournInfo, setTournInfo] = useState(defaultDate);
  useEffect(() => {
    if (!tid) return; // Add this line
    fetch(`/api/tournaments/${tid}`)
      .then((response) => response.json())
      .then((data) => setTournInfo(data.data || defaultDate))
      .catch((error) => {
        setTournInfo(defaultDate)
        console.error(`Error fetching tournament info for [${tid}]`, error);  
      });
  }, [tid]);

  return { tournInfo }
}
