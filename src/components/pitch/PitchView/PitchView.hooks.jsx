import { useState, useEffect } from "react";
import API from "../../../shared/api/endpoints.js";

export const useFetchFixtures = (tournamentId, pitchId) => {
  const [fixtures, setFixtures] = useState([]);
  const [nextFixture, setNextFixture] = useState(null);

  const fetchFixtures = async () => {
    // Fetch the data
    const { data } = await API.fetchFixtures(tournamentId, pitchId);
    // Only update the list, do not automatically recalculate nextFixture here
    setFixtures(data);
    // nextFixture state will only be set initially by the useEffect below
  };

  useEffect(() => {
    // Initial fetch and setting of the *first* nextFixture
    const initialFetch = async () => {
      const { data } = await API.fetchFixtures(tournamentId, pitchId);
      setFixtures(data);
      // Set the initial next fixture based on the first fetch
      setNextFixture(data.filter((f) => !f.played).shift());
    };
    initialFetch();
    // Intentionally omitting fetchFixtures from dependency array
    // to ensure this effect only runs on mount/param change to set the *initial* nextFixture.
  }, [tournamentId, pitchId]);

  // Return the initial nextFixture, the list, and the function to refresh the list
  return { fixtures, nextFixture, fetchFixtures };
};

export const useStartMatch = (tournamentId, pitchId, fetchFixtures) => {
  const startMatch = async (fixtureId) => {
    await API.startMatch(tournamentId, fixtureId);
    await fetchFixtures();
  };

  return startMatch;
};
