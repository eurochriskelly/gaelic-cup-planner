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

  useEffect(() => {
    // Fetch tournaments when component mounts
    setIsLoadingTournaments(true);
    setFetchError(null);
    API.fetchActiveTournaments()
      .then(response => {
        // Assuming the API returns { data: [...] }
        setAvailableTournaments(response?.data || []);
      })
      .catch(error => {
        console.error("Error fetching tournaments:", error);
        setFetchError("Failed to load tournaments.");
        setAvailableTournaments([]); // Ensure it's an empty array on error
      })
      .finally(() => {
        setIsLoadingTournaments(false);
      });

    // Check for existing tournament cookie
    const tid = Cookies.get("tournamentId");
    if (tid && tid !== "undefined") {
      navigate(`/tournament/${tid}`, { replace: true });
    }
  }, [navigate]);

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

  const selectTournament = (id) => {
    setupTournament(id);
    Cookies.set("tournamentId", id, { expires: 1 / 24, path: "/" });
    setIsThinking(true);
    setTimeout(() => {
      navigate(`/tournament/${id}`, { replace: true });
      setIsThinking(false);
    }, 500);
  };

  const onPinEntered = (enteredPin) => {
    // Check if a tournament is selected and has a PIN property
    if (selectedTournament && selectedTournament.code) {
      if (enteredPin?.toLowerCase() === selectedTournament?.code?.toLowerCase()) {
        // PIN matches, proceed to select the tournament
        selectTournament(selectedTournament.Id);
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
           <LoginHeader version={versionInfo?.mobile} />
           <div className="pinLogin">No active tournaments found.</div>
           <div className="version-info">{`Pitch Perfect v${versionInfo?.mobile}`}</div>
         </>
       );
    }
  } // End of loading/error/empty checks

  // Main return statement for the component
  return (
    <> {/* Use Fragment to wrap header and content */}
      <LoginHeader version={versionInfo?.mobile} />

      {/* Conditional rendering for Tournament Selection or PIN Entry */}
        {!selectedTournament ? (
          // Tournament Selection View
          <div className="pinLogin tournament-selection-view">
            {/* Subheading before the tournament list */}
            <h3>Select from upcoming tournaments</h3>

            <div className="tournamentList">
              {/* Use the TournamentCard component for the list */}
              {availableTournaments.map((t) => (
                <TournamentCard
                  key={t.Id}
                  title={t.Title}
                  location={t.Location}
                  date={t.Date}
                  onClick={() => setSelectedTournament(t)}
                />
              ))}
            </div>
          </div>
        ) : (
          // PIN Entry View
          <div className="pinLogin pin-entry-view" style={{ position: 'relative' }}>
            {/* Back Icon Span */}
            <span className="back-icon-span" onClick={() => setSelectedTournament(null)}>
              <i className="pi pi-arrow-circle-left"></i>
            </span>

            {/* Display selected tournament using the TournamentCard component */}
            <div className="selected-tournament-display">
              <TournamentCard
                title={selectedTournament?.Title}
                location={selectedTournament?.Location}
                date={selectedTournament?.Date}
              />
            </div>

            {/* Updated prompt text and added class */}
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

            {/* Message display area */}
            <div className="pin-message">&nbsp;{message}&nbsp;</div>
          </div>
        )}

        {/* Version info - rendered outside main content */}
        <div className="version-info">{`Pitch Perfect v${versionInfo?.mobile}`}</div>
      </>
    );
};

export default PinLogin;
