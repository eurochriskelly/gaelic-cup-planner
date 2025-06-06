import { createContext, useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";

const Context = createContext();

const versionInfo = {
  mobile: "%%0.5.57_RC%%".replace(/%/g, ''),
  desktop: "%%0.0.57_RC%%".replace(/%/g, ''),
};

export const Provider = ({ children }) => {
  const [mediaType, setMediaType] = useState(null);
  const [tournamentId, setTournamentId] = useState(null);
  const [sections, setSections] = useState([]);
  const [userRole, setUserRole] = useState(() => Cookies.get("ppUserRole") || 'coordinator');
  
  // Add state for filter selections - make it role-specific
  const [filterSelections, setFilterSelections] = useState(() => {
    const savedFilters = Cookies.get("ppFilterSelections");
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        // If the saved filters are already role-specific, use them
        if (parsedFilters && typeof parsedFilters === 'object' && Object.keys(parsedFilters).some(key => 
          ['coordinator', 'coach', 'referee', 'organizer', 'spectator'].includes(key.toLowerCase()))) {
          return parsedFilters;
        }
        // Otherwise, convert the old format to the new role-specific format
        const currentRole = Cookies.get("ppUserRole") || 'coordinator';
        return { [currentRole]: parsedFilters || {} };
      } catch (e) {
        console.error("Error parsing saved filters:", e);
        return {};
      }
    }
    return {};
  });

  const setUserRoleAndCookie = (role) => {
    setUserRole(role);
    Cookies.set("ppUserRole", role, { expires: 365, path: "/" });
  };

  // Update method to make filter selections role-specific
  const updateFilterSelections = (newSelections) => {
    const updatedSelections = {
      ...filterSelections,
      [userRole]: newSelections
    };
    
    setFilterSelections(updatedSelections);
    Cookies.set("ppFilterSelections", JSON.stringify(updatedSelections), { expires: 7, path: "/" });
  };

  // Get current role's filter selections
  const getCurrentRoleFilterSelections = () => {
    return filterSelections[userRole] || {};
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
        filterSelections: getCurrentRoleFilterSelections(), // Return only current role's selections
        updateFilterSelections,
        allFilterSelections: filterSelections // Provide access to all filter selections if needed
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => useContext(Context);
