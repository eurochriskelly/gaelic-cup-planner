import { useState, useEffect } from 'react';

export function useTournamentInfo(tournamentId) {
  const [tournInfo, setTournInfo] = useState({ title: '', location: '' });
  const [originalInfo, setOriginalInfo] = useState({});
  const [date, setDate] = useState(null);
  const [originalDate, setOriginalDate] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    fetch(`/api/tournaments/${tournamentId}`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedInfo = {
          title: data.data.Title,
          location: data.data.Location
        };
        setTournInfo(fetchedInfo);
        setOriginalInfo(fetchedInfo);
        const fetchedDate = data.data.Date?.substring(0, 10);
        setDate(fetchedDate);
        setOriginalDate(fetchedDate);
        setRegion(data.data.Region);
      })
      .catch((error) => console.error("Error fetching tournament info:", error));
  }, [tournamentId]);

  return { tournInfo, setTournInfo, originalInfo, date, setDate, originalDate, region, setRegion };
}

export function useRegions() {
  const [filteredRegions, setFilteredRegions] = useState([]);
  const regions = [
    { name: 'North America' },
    { name: 'South America' },
    { name: 'Europe' },
    { name: 'Asia' },
    { name: 'Africa' },
    { name: 'Australia' }
  ];

  useEffect(() => {
    fetch(`/api/regions`)
      .then((response) => response.json())
      .then((data) => {
        if (data?.foo) console.log(data);
        // Handle region data if needed
      })
      .catch((error) => console.error("Error fetching regions:", error));
  }, []);

  const searchRegion = (event) => {
    setTimeout(() => {
      let _filteredRegions;
      if (!event.query.trim().length) {
        _filteredRegions = [...regions];
      } else {
        _filteredRegions = regions.filter((region) =>
          region.name.toLowerCase().startsWith(event.query.toLowerCase())
        );
      }
      setFilteredRegions(_filteredRegions);
    }, 250);
  };

  return { filteredRegions, searchRegion };
}
