import { useState, useEffect } from 'react';
import API from "../../../../shared/api/endpoints";

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

export const useFetchPitches = (tid) => {
  const [pitches, setPitches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tid) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    API.fetchPitches(tid)
      .then(({ data }) => {
        if (!isMounted) return;
        const normalised = (data || []).map((pitch, index) => {
          const id = pitch.pitch || pitch.id || `pitch-${index + 1}`;
          const label = pitch.pitch || pitch.name || `Pitch ${index + 1}`;
          return {
            id: `${id}`,
            label,
            details: pitch,
          };
        });
        setPitches(normalised);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(`Error fetching pitches for [${tid}]`, err);
        setError(err);
        setPitches([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [tid]);

  return { pitches, isLoading, error };
};
