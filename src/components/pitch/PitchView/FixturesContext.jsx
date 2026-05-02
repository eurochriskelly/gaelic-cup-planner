// FixtureContext.js
import { createContext, useContext, useState, useEffect } from "react";
import API from "../../../shared/api/endpoints.js";
import { useAppContext } from "../../../shared/js/Provider";
import { getCoordinatedPitches, normalizePitchId } from "../../../shared/js/pitchSelection";

const FixtureContext = createContext();

export const useFixtureContext = () => useContext(FixtureContext);

const withoutPitchFilter = (filterSelections = {}) => {
  const { pitches, Pitches, ...remainingFilters } = filterSelections;
  return remainingFilters;
};

const normalizePitchList = (response) => {
  const pitchList = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];

  return Array.from(new Set(
    pitchList
      .map((pitch, index) => normalizePitchId(pitch?.pitch || pitch?.id || pitch?.name || `Pitch ${index + 1}`))
      .filter(Boolean)
  ));
};

export const FixtureProvider = ({ tournamentId, pitchId, children }) => {
  const [fixture, setFixture] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [nextFixture, setNextFixture] = useState(null);
  const [allPitches, setAllPitches] = useState([]);
  const { 
    userRole, 
    filterSelections, 
  } = useAppContext();
  const coordinatedPitches = getCoordinatedPitches(filterSelections);
  const fixtureFilter = withoutPitchFilter(filterSelections);

  const fetchFixtures = async (progress = false) => {
    const { data } = await API.fetchFilteredFixtures(tournamentId, fixtureFilter);
    const fixturesData = data || [];
    setFixtures(fixturesData);
    if (progress) {
        setNextFixture(fixturesData.find((f) => !f.played));
    } else {
        const nf = fixturesData.find((f) => f?.id === nextFixture?.id);
        if (nf) {
            setNextFixture(nf);
        } else {
            setNextFixture(fixturesData.find((f) => !f.played));
        }
    }
  };

  const fetchFixture = async () => {
    // wait 0.5 seconds
    const { data } = await API.fetchFixture(tournamentId, nextFixture?.id);
    setFixture(data);
    const nextFixture = data.find((f) => !f.played && f.ended);
    setNextFixture(nextFixture);
  };

  const startMatch = async (fixtureId) => {
    await API.startMatch(tournamentId, fixtureId);
    await fetchFixtures();
  };

  useEffect(() => {
    const initialFetch = async () => {
      const { data } = await API.fetchFilteredFixtures(tournamentId, fixtureFilter)
      const fixturesData = data || [];
      setFixtures(fixturesData);
      const nextFixture = fixturesData.find((f) => !f.played);
      setNextFixture(nextFixture);
    };
    initialFetch();
  }, [tournamentId, pitchId, filterSelections]);

  useEffect(() => {
    if (!tournamentId) return;

    API.fetchPitches(tournamentId)
      .then((response) => setAllPitches(normalizePitchList(response)))
      .catch(() => setAllPitches([]));
  }, [tournamentId]);

  return (
    <FixtureContext.Provider value={{ 
        fixture,
        fixtures, 
        nextFixture, 
        fetchFixture, 
        fetchFixtures, 
        startMatch,
        tournamentId,
        pitchId,
        allPitches,
        coordinatedPitches
      }}>
      {children}
    </FixtureContext.Provider>
  );
};
