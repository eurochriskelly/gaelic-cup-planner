import { createContext, useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";

const Context = createContext();

const versionInfo = {
  mobile: "%%0.4.30_RC%%".replace(/%/g, ''),
  desktop: "%%0.0.29_RC%%".replace(/%/g, ''),
};

export const Provider = ({ children }) => {
  const [mediaType, setMediaType] = useState(null);
  const [tournamentId, setTournamentId] = useState(null);
  const [sections, setSections] = useState([]);

  const setupTournament = (id) => {
    setTournamentId(id);
    if (id) {
      Cookies.set("tournamentId", id, { expires: 1 / 24, path: "/" });
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
    const tid = Cookies.get("tournamentId"); // Check cookie on mount
    if (tid) setupTournament(tid);
    return () => {};
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
