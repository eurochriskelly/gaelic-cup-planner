import { createContext, useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";

const Context = createContext();

const versionInfo = {
  mobile: "%%0.5.55_RC%%".replace(/%/g, ''),
  desktop: "%%0.0.54_RC%%".replace(/%/g, ''),
};

export const Provider = ({ children }) => {
  const [mediaType, setMediaType] = useState(null);
  const [tournamentId, setTournamentId] = useState(null);
  const [sections, setSections] = useState([]);
  const [userRole, setUserRole] = useState(() => Cookies.get("ppUserRole") || 'coordinator');

  const setUserRoleAndCookie = (role) => {
    setUserRole(role);
    Cookies.set("ppUserRole", role, { expires: 365, path: "/" });
  };

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
    // mediaQuery.addListener(handleMediaQueryChange); // Deprecated
    mediaQuery.addEventListener("change", handleMediaQueryChange); // Modern way
    const tid = Cookies.get("tournamentId"); // Check cookie on mount
    if (tid) setupTournament(tid);
    
    // Cleanup listener
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Context.Provider
      value={{
        mediaType,
        tournamentId,
        setupTournament,
        sections,
        versionInfo,
        userRole,
        setUserRoleAndCookie,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => useContext(Context);
