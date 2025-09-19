import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import API from "../../api/endpoints.js";
import TournamentCard from "./TournamentCard"; // Import the new component
import LoginHeader from "../LoginHeader"; // Import the new LoginHeader component
import Cookies from "js-cookie";
import "./PinLogin.scss";

// Removed AppHeader definition from here

const PinLogin = () => {
  const { setupTournament, versionInfo, userRole, setUserRoleAndCookie } = useAppContext();
  const navigate = useNavigate();
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

  useEffect(() => {
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
  
  const handleTournamentCardClick = (tournament) => {
    setMessage(""); // Clear previous messages
    // If tournament.code exists, it's PIN protected, show PIN screen.
    // Otherwise, allow direct navigation (spectator-like access).
    if (tournament.code) {
      setSelectedTournament(tournament);
      // Default pinEntryRole based on current global userRole, or 'coach'
      if (['organizer', 'coordinator', 'coach'].includes(userRole)) {
        setPinEntryRole(userRole);
      } else {
        setPinEntryRole('coach');
      }
      setPin(["", "", "", ""]); // Clear previous PIN
    } else {
      directNavigateToTournament(tournament.Id);
    }
  };

  const handleContinueAsSpectator = () => {
    if (selectedTournament) {
      // Ensure the tournamentId cookie is set for backward compatibility
      Cookies.set("tournamentId", selectedTournament.Id, { expires: 1 / 24, path: "/" });
      setIsThinking(true); // Show loading feedback
      
      // Check if eventUuid exists and redirect to the new planner URL
      if (selectedTournament.eventUuid) {
        const url = `https://planner.pitchperfect.eu.com/event/${selectedTournament.eventUuid}`;
        window.location.href = url;
      } else {
        // Fallback to original behavior if eventUuid is not available
        window.location.href = `/tournament/${selectedTournament.Id}`;
      }
    } else {
      // Fallback: if selectedTournament is somehow not available, go to the root.
      setIsThinking(true);
      window.location.href = `/`;
    }
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
              {['organizer', 'coordinator', 'coach', 'referee'].map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`role-button ${userRole === role ? 'active-role' : ''}`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                  {userRole === role ? ' *' : ''}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {!selectedTournament ? (
              // Tournament Selection View
              <div className="tournament-selection-view"> {/* Removed pinLogin class from here */}
                <h2>Select from upcoming tournaments</h2>
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
                <div className="pin-entry-prompt">Enter tournament code</div>
                <div className="role-for-pin-container " style={{ margin: '10px 0 30px 0', textAlign: 'center', fontSize: '2.25em' }}>
                  for role <i className="pi pi-user text-5xl" style={{ margin: '0 12px 0 12px' }}></i>
                  <select
                    value={pinEntryRole}
                    onChange={(e) => setPinEntryRole(e.target.value)}
                    className="pin-entry-role-select"
                    style={{
                      padding: '1.4rem 1rem',
                      borderRadius: '0.6rem',
                      color: '#64752b',
                      background: "rgb(168 174 147 / 35%)",
                      textAlign: 'center',
                      marginLeft: '5px', 
                      textTransform: 'uppercase', fontSize: 'inherit' 
                    }}>
                    <option value="organizer" style={{ fontSize: '0.5em' }}>Organizer</option>
                    <option value="coordinator" style={{ fontSize: '0.5em' }}>Coordinator</option>
                    <option value="coach" style={{ fontSize: '0.5em' }}>Coach</option>
                    <option value="referee" style={{ fontSize: '0.5em' }}>Referee</option>
                  </select>
                </div>
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
                  <div className="spectator-access-prompt">
                    <div>Spectator access? </div>
                    <button onClick={handleContinueAsSpectator} className="spectator-access-button">
                      Continue without login
                    </button>
                  </div>
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
      <div className="version-info">{`Pitch Perfect v${versionInfo?.mobile}`}</div>
    </>
  );
};

export default PinLogin;
