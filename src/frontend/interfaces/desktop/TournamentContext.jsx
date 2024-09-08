import { createContext, useContext, useEffect, useState } from 'react';
import { Tournament, testdata } from 'gcp-core'; // assuming Tournament is a class

const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
  const [tournament] = useState(new Tournament());
  useEffect(() => {
    const { tournaments } = testdata.default
    tournament.load(tournaments.t2)
  }, []);

  return (
    <TournamentContext.Provider value={tournament}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
    return useContext(TournamentContext);
};
