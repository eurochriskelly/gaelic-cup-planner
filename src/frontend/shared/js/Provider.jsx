import { createContext, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const Context = createContext();

const versionInfo = {
  mobile: "0.2.11",
  desktop: "0.0.1",
};
export const Provider = ({ children }) => {
  let tid = null;
  const params = useParams();
  if (params.tournamentId) tid = params.tournamentId;
  if (!tid) tid = Cookies.get(tid);
  
  const [mediaType, setMediaType] = useState(null);
  const [tournamentId, setTournamentId] = useState(null);
  const [sections, setSections] = useState([]);

  const setupTournament = (id) => {
    setTournamentId(id);
    if (id){
      Cookies.set('tournamentId', id, { expires: 1/24, path: '/'});
    }
    setSections([
      {
        title: "live competition status",
        name: "competitions",
        path: `/tournament/${id}/selectCategory`,
      },
      {
        title: "field coordination",
        name: "pitches",
        path: `/tournament/${id}/selectPitch`,
      },
      {
        title: "login",
        name: "reset",
        path: `/`,
      },
    ]);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleMediaQueryChange = (event) => {
      setMediaType(event.matches ? "phone" : "desktop");
    };
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addListener(handleMediaQueryChange);
    setupTournament(tid);
    return () => {
    };
  }, []);

  return (
    <Context.Provider
      value={{ mediaType, tournamentId, setupTournament, sections, versionInfo }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => useContext(Context);
