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
    fetchFixtures();
  }, [tournamentId, pitchId]);

  return { fixtures, nextFixture, fetchFixtures };
};

export const useStartMatch = (tournamentId, pitchId, fetchFixtures) => {
  const startMatch = async (fixtureId) => {
    await API.startMatch(tournamentId, fixtureId);
    await fetchFixtures();
  };

  return startMatch;
};
