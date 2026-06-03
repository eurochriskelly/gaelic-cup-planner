import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import API from "../../api/endpoints.js";
import TournamentCard from "./TournamentCard"; // Import the new component
import LoginHeader from "../LoginHeader"; // Import the new LoginHeader component
import Cookies from "js-cookie";
import "./PinLogin.scss";
import config from "../../../interfaces/mobile/config";

// Removed AppHeader definition from here

const PinLogin = () => {
  const { setupTournament, versionInfo, userRole, setUserRoleAndCookie } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [isThinking, setIsThinking] = useState(false);
  const [message, setMessage] = useState("");
  const inputsRef = useRef([]);
  const [availableTournaments, setAvailableTournaments] = useState([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [pinEntryRole, setPinEntryRole] = useState('coordinator');

  const [showRoleSelectorView, setShowRoleSelectorView] = useState(false); // Default to not showing role selector
  const currentRole = (userRole || 'spectator').toLowerCase();
  const pinProtectedRoles = ['organizer', 'coordinator', 'coach', 'referee'];
  const tournamentHeadingByRole = {
    spectator: 'Select to follow live scores',
    coordinator: 'Coordinate tournament',
    organizer: 'Organize tournament',
    referee: 'Ref tournament',
    coach: 'Manage team for event',
  };
  const tournamentHeading = tournamentHeadingByRole[currentRole] || tournamentHeadingByRole.spectator;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedRoleParam = params.get('role')?.toLowerCase();
    const requestedRole = requestedRoleParam === 'organiser'
      ? 'organizer'
      : requestedRoleParam;
    const validRoles = ['spectator', ...pinProtectedRoles];

    if (requestedRole && validRoles.includes(requestedRole)) {
      if (requestedRole !== currentRole) {
        setUserRoleAndCookie(requestedRole);
        setSelectedTournament(null);
        setPin(["", "", "", ""]);
        setMessage("");
      }

      params.delete('role');
      const nextSearch = params.toString();
      navigate(
        {
          pathname: location.pathname,
          search: nextSearch ? `?${nextSearch}` : '',
        },
        { replace: true },
      );
    }
  }, [location.pathname, location.search, currentRole, navigate, setUserRoleAndCookie]);

  useEffect(() => {
    // Check for auth bypass in development
    if (import.meta.env.VITE_BYPASS_AUTH === '1') {
      const bypassTournamentId = import.meta.env.VITE_TOURNAMENT_ID
      if (bypassTournamentId) {
        setupTournament(bypassTournamentId)
        Cookies.set('tournamentId', bypassTournamentId, { expires: 1 / 24, path: '/' })
        navigate(`/tournament/${bypassTournamentId}`, { replace: true })
        return
      }
    }

    // userRole is now managed by AppContext/Provider, which initializes from cookie.
    // PinLogin consumes this userRole directly from useAppContext.

    // Fetch tournaments when component mounts
    setIsLoadingTournaments(true);
    setFetchError(null);
    API.fetchActiveTournaments()
      .then(response => {
        setAvailableTournaments(response?.data || []);
      })
      .catch(error => {
        console.error("Error fetching tournaments:", error);
        setFetchError("Failed 2 load tournaments!");
        setAvailableTournaments([]);
      })
      .finally(() => {
        setIsLoadingTournaments(false);
      });

    // Check for existing tournament cookie if not showing role selector
    // and navigate if a tournamentId is already set (e.g. user refreshes page)
    if (!showRoleSelectorView) {
        const tid = Cookies.get("tournamentId");
        if (tid && tid !== "undefined" && !selectedTournament) { // also check selectedTournament to avoid loop if already on pin screen
            // Potentially verify if this tournament is still valid for the role or if PIN is needed
            // For now, directly navigate if tid exists.
            // This part might need refinement if role changes should invalidate existing tid immediately.
            // navigate(`/tournament/${tid}`, { replace: true }); // This might be too aggressive if user just changed role
        }
    }
  }, [navigate]); // Removed showRoleSelectorView from deps to avoid re-triggering navigation from cookie check

  // focus first PIN input when a tournament is selected
  useEffect(() => {
    if (selectedTournament) {
      inputsRef.current[0]?.focus();
    }
  }, [selectedTournament]);

  const handleChange = (e, index) => {
    const value = e.target.value.slice(0, 1);

    // Check if entering into a later input while previous ones are empty
    if (index > 0 && value) {
      const previousInputs = pin.slice(0, index);
      if (previousInputs.some(p => p === '')) {
        // Reset pin and focus first input if any previous input is empty
        setPin(["", "", "", ""]);
        inputsRef.current[0]?.focus();
        return; // Stop further processing for this input
      }
    }

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Move focus to the next input if a value was entered and it's not the last input
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    // Check if the PIN is complete
    if (newPin.every((num) => num !== "")) {
      const joined = newPin.join("");
      onPinEntered(joined);
    }
  };

  const handleRoleSelect = (role) => {
    setUserRoleAndCookie(role); // Use context function
    setShowRoleSelectorView(false);
    setSelectedTournament(null); // Ensure we are on tournament list view
    setPin(["", "", "", ""]);    // Clear any stale PIN
    setMessage("");             // Clear any stale message

    if (new URLSearchParams(location.search).has('role')) {
      const params = new URLSearchParams(location.search);
      params.delete('role');
      const nextSearch = params.toString();
      navigate(
        {
          pathname: location.pathname,
          search: nextSearch ? `?${nextSearch}` : '',
        },
        { replace: true },
      );
    }
  };

  const directNavigateToTournament = (tournamentId) => {
    setupTournament(tournamentId);
    Cookies.set("tournamentId", tournamentId, { expires: 1 / 24, path: "/" });
    setIsThinking(true);
    setTimeout(() => {
      navigate(`/tournament/${tournamentId}`, { replace: true });
      setIsThinking(false);
    }, 500);
  };

  const redirectToLiveScores = (tournament) => {
    if (!tournament) {
      setIsThinking(true);
      window.location.href = `/`;
      return;
    }

    if (!tournament.eventUuid) {
      setMessage('Live results are not available for this tournament yet.');
      return;
    }

    setUserRoleAndCookie('spectator');
    setIsThinking(true);
    window.location.href = `${config.resultsAppUrl}/events/${tournament.eventUuid}`;
  };
  
  const handleTournamentCardClick = (tournament) => {
    setMessage(""); // Clear previous messages
    if (currentRole === 'spectator') {
      redirectToLiveScores(tournament);
      return;
    }

    // If tournament.code exists, it's PIN protected, show PIN screen.
    // Otherwise, allow direct navigation (spectator-like access).
    if (tournament.code) {
      setSelectedTournament(tournament);
      // Default pinEntryRole based on current global userRole, or 'coach'
      if (pinProtectedRoles.includes(currentRole)) {
        setPinEntryRole(currentRole);
      } else {
        setPinEntryRole('coach');
      }
      setPin(["", "", "", ""]); // Clear previous PIN
    } else {
      directNavigateToTournament(tournament.Id);
    }
  };

  const handleContinueAsSpectator = () => {
    redirectToLiveScores(selectedTournament);
  };

  const onPinEntered = async (enteredPin) => {
    if (selectedTournament) {
      setIsThinking(true);
      setMessage(""); // Clear previous messages
      try {
        await API.checkTournamentCode(selectedTournament.Id, enteredPin, pinEntryRole);
        // PIN is valid for the role
        setUserRoleAndCookie(pinEntryRole); // Set the global role
        directNavigateToTournament(selectedTournament.Id); // Navigate (handles its own setIsThinking)
      } catch (error) {
        setIsThinking(false); // Reset thinking state on error
        console.error("PIN check failed:", error);

        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        if (attempts >= 3) {
          setMessage("Too many invalid attempts");
          setTimeout(() => {
            setPin(["", "", "", ""]);
            setMessage("");
            setFailedAttempts(0);
            setSelectedTournament(null); // Go back to tournament selection
          }, 2000);
        } else {
          setMessage("Invalid pin for selected role!");
          setTimeout(() => {
            setPin(["", "", "", ""]);
            if (inputsRef.current[0]) {
              inputsRef.current[0].focus();
            }
            setMessage("");
          }, 2000);
        }
      }
    } else {
      // Handle case where tournament is not selected (should not normally happen if flow is correct)
      console.error("Error: No selected tournament found for PIN validation.");
      setMessage("An error occurred. Please select a tournament again.");
      setPin(["", "", "", ""]);
      inputsRef.current[0]?.focus();
      setTimeout(() => {
        setSelectedTournament(null); // Go back to selection
        setMessage("");
      }, 2500);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newPin = [...pin];
      if (newPin[index] !== '') {
        newPin[index] = '';
        setPin(newPin);
      } else if (index > 0) {
        newPin[index - 1] = '';
        setPin(newPin);
        inputsRef.current[index - 1].focus();
      }
    }
  };

  // step 1: choose tournament
  if (!selectedTournament) {
    if (isLoadingTournaments) {
      return <div className="pinLogin thinking">Loading tournaments...</div>;
    }
    if (fetchError) {
      return <div className="pinLogin error">{fetchError}</div>;
    }
    if (availableTournaments.length === 0) {
       // Handle empty state - Render header and message
       return (
         <>
           {/* Pass showBackButton={false} */}
           <LoginHeader version={versionInfo?.mobile} showBackButton={false} />
           <div className="pinLogin">No active tournaments found.</div>
           <div className="version-info">{`Pitch Perfect v${versionInfo?.mobile}`}</div>
         </>
       );
    }
  } // End of loading/error/empty checks

  // Main return statement for the component
  return (
    <>
      <LoginHeader
        version={versionInfo?.mobile}
        showBackButton={showRoleSelectorView || (!!selectedTournament && !showRoleSelectorView)}
        onBackClick={() => {
          if (showRoleSelectorView) {
            setShowRoleSelectorView(false);
          } else {
            setSelectedTournament(null);
            setPin(["", "", "", ""]);
            setMessage("");
          }
        }}
      />
      <div className={`pinLogin ${showRoleSelectorView ? 'role-selector-active-parent' : ''}`}>
        {showRoleSelectorView ? (
          <div className="role-selector-container">
            <h2>Select Your Role</h2>
            {/* Back button is now handled by LoginHeader */}
            <div className="role-grid">
              {pinProtectedRoles.map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`role-button ${currentRole === role ? 'active-role' : ''}`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                  {currentRole === role ? ' *' : ''}
                </button>
              ))}
            </div>
            <div className="role-live-choice">
              <div className="role-grid-separator">OR</div>
              <button
                onClick={() => handleRoleSelect('spectator')}
                className={`role-button role-button-live ${currentRole === 'spectator' ? 'active-role' : ''}`}
              >
                Live Scores Only
                {currentRole === 'spectator' ? ' *' : ''}
              </button>
            </div>
          </div>
        ) : (
          <>
            {!selectedTournament ? (
              // Tournament Selection View
              <div className="tournament-selection-view"> {/* Removed pinLogin class from here */}
                <h2>{tournamentHeading}</h2>
                {message && <div className="general-message">{message}</div>}
                {isLoadingTournaments && <div className="thinking">Loading tournaments...</div>}
                {fetchError && <div className="error">{fetchError}</div>}
                {!isLoadingTournaments && !fetchError && availableTournaments.length === 0 && !message && (
                  <div>No active tournaments found.</div>
                )}
                <div className="tournamentList">
                  {availableTournaments.map((t) => (
                    <TournamentCard
                      key={t.Id}
                      title={t.Title}
                      location={t.Location}
                      date={t.Date}
                      onClick={() => handleTournamentCardClick(t)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // PIN Entry View
              <div className="pin-entry-view"> {/* Removed pinLogin class from here */}
                <div className="selected-tournament-display">
                  <TournamentCard
                    title={selectedTournament?.Title}
                    location={selectedTournament?.Location}
                    date={selectedTournament?.Date}
                  />
                </div>
                <div className="pin-entry-prompt">Enter {pinEntryRole.toUpperCase()} code</div>
                <div className="pinContainer">
                  {pin.map((num, index) => (
                    <input
                      className={isThinking ? "thinking" : ""}
                      key={index}
                      ref={(el) => (inputsRef.current[index] = el)}
                      value={num}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      maxLength="1"
                    />
                  ))}
                </div>
                  <div className="pin-message">&nbsp;{message}&nbsp;</div>
              </div>
            )}
          </>
        )}
        {!showRoleSelectorView && !selectedTournament && (
          <button
            className="hat-icon-button pi pi-user"
            onClick={() => {
              setShowRoleSelectorView(true);
              setSelectedTournament(null);
              setPin(["", "", "", ""]);
              setMessage("");
            }}
            title="Change Role"
          >
            {/* CSS will style the icon */}
          </button>
        )}
      </div>
      <div className="bottom-gradient-bg"></div>
      <div className="version-info">{`Pitch Perfect v${versionInfo?.mobile}`}</div>
    </>
  );
};

export default PinLogin;
