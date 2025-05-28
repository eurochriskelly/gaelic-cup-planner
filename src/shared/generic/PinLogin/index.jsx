import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../shared/js/Provider";
import API from "../../api/endpoints.js";
import TournamentCard from "./TournamentCard"; // Import the new component
import LoginHeader from "../LoginHeader"; // Import the new LoginHeader component
//import LanguageSwitcher from "../LanguageSwitcher";
import Cookies from "js-cookie";
import "./PinLogin.scss";

// Removed AppHeader definition from here

const PinLogin = () => {
  const { t } = useTranslation();
  const { setupTournament, versionInfo } = useAppContext();
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

  const [userRole, setUserRole] = useState('spectator'); // Default role
  const [showRoleSelectorView, setShowRoleSelectorView] = useState(false); // Default to not showing role selector

  useEffect(() => {
    const roleFromCookie = Cookies.get("ppUserRole");
    if (roleFromCookie) {
      setUserRole(roleFromCookie);
      // showRoleSelectorView remains false (its initial state), 
      // ensuring user goes to tournament view.
    } else {
      // No cookie found. userRole is already 'spectator' (from useState).
      // showRoleSelectorView remains false (its initial state).
      // User will see the tournament list by default.
    }

    // Fetch tournaments when component mounts
    setIsLoadingTournaments(true);
    setFetchError(null);
    API.fetchActiveTournaments()
      .then(response => {
        setAvailableTournaments(response?.data || []);
      })
      .catch(error => {
        console.error("Error fetching tournaments:", error);
        setFetchError("Failed to load tournaments.");
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
    setUserRole(role);
    Cookies.set("ppUserRole", role, { expires: 365, path: "/" }); // Store for a year
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
    if (userRole === 'spectator') {
      directNavigateToTournament(tournament.Id);
    } else if (userRole !== 'spectator' && !tournament.code) {
      setMessage(`Tournament "${tournament.Title}" requires a PIN for ${userRole} access.`);
      setTimeout(() => setMessage(""), 3000); 
    } else {
      // This case handles non-spectators who need to enter a PIN for a tournament that has one.
      setSelectedTournament(tournament);
    }
  };

  const onPinEntered = (enteredPin) => {
    // Check if a tournament is selected and has a PIN property
    if (selectedTournament && selectedTournament.code) {
      if (enteredPin?.toLowerCase() === selectedTournament?.code?.toLowerCase()) {
        // PIN matches, proceed to select the tournament
        directNavigateToTournament(selectedTournament.Id);
      } else {
        // PIN does not match, handle invalid attempt
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        if (attempts >= 3) {
          setMessage("Too many invalid attempts");
          // After lockout message, clear pin and go back to tournament selection
          setTimeout(() => {
            setPin(["", "", "", ""]); // Clear PIN on lockout timeout
            setMessage("");
            setFailedAttempts(0);
            setSelectedTournament(null); // Go back to tournament selection
          }, 2000);
        } else {
          // Display invalid pin message, keep digits visible
          setMessage("Invalid pin! " + enteredPin);
          // Keep the inputs filled for 2 seconds, then reset
          setTimeout(() => {
            setPin(["", "", "", ""]); // Reset PIN after delay
            inputsRef.current[0]?.focus(); // Refocus after delay
            setMessage(""); // Clear message after delay
          }, 2000);
        }
      }
    } else {
      // Handle case where tournament or PIN is missing (should not normally happen if flow is correct)
      console.error("Error: No selected tournament or PIN found for validation.");
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
              <button onClick={() => handleRoleSelect('organizer')} className="role-button">Organizer</button>
              <button onClick={() => handleRoleSelect('coordinator')} className="role-button">Coordinator</button>
              <button onClick={() => handleRoleSelect('coach')} className="role-button">Coach</button>
              <button onClick={() => handleRoleSelect('spectator')} className="role-button">Spectator</button>
            </div>
          </div>
        ) : (
          <>
            {!selectedTournament ? (
              // Tournament Selection View
              <div className="tournament-selection-view"> {/* Removed pinLogin class from here */}
                <h3>Select from upcoming tournaments</h3>
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
        {!showRoleSelectorView && (
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
