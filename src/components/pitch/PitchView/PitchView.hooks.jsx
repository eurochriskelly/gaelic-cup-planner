import { useState, useEffect } from "react";
import API from "../../../shared/api/endpoints.js";

export const useFetchFixtures = (tournamentId, pitchId) => {
  const [fixtures, setFixtures] = useState([]);
  const [nextFixture, setNextFixture] = useState(null);

  const fetchFixtures = async () => {
    const { data } = await API.fetchFixtures(tournamentId, pitchId);
    setFixtures(data);
    setNextFixture(data.filter((f) => !f.played).shift());
  };

  useEffect(() => {
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
