// FixtureContext.js
import { createContext, useContext, useState, useEffect } from "react";
import API from "../../../shared/api/endpoints.js";

const FixtureContext = createContext();

export const useFixtureContext = () => useContext(FixtureContext);

export const FixtureProvider = ({ tournamentId, pitchId, userRole, children }) => {
  const [fixture, setFixture] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [nextFixture, setNextFixture] = useState(null);

  const fetchFixtures = async (progress = false) => {
    const { data } = await API.fetchFixtures(tournamentId, pitchId);
    setFixtures(data);
    if (progress) {
        setNextFixture(data.find((f) => !f.played));
    } else {
        const nf = data.find((f) => f?.id === nextFixture?.id);
        if (nf) {
            setNextFixture(nf);
        } else {
            setNextFixture(data.find((f) => !f.played));
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
      const { data } = await API.fetchFixtures(tournamentId, pitchId);
      setFixtures(data);
      const nextFixture = data.find((f) => !f.played);
      setNextFixture(nextFixture);
    };
    initialFetch();
  }, [tournamentId, pitchId]);

  return (
    <FixtureContext.Provider value={{ 
        fixture,
        fixtures, 
        nextFixture, 
        fetchFixture, 
        fetchFixtures, 
        startMatch 
      }}>
      {children}
    </FixtureContext.Provider>
  );
};