import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../shared/js/Provider";
import API from "../../api/endpoints.js";
//import LanguageSwitcher from "../LanguageSwitcher";
import Cookies from "js-cookie";
import "./PinLogin.scss";

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

    // Focus first input if pin entry is shown (handled later)
    // inputsRef.current[0]?.focus();

    // Check for existing tournament cookie
    const tid = Cookies.get("tournamentId");
    if (tid && tid !== "undefined") {
      navigate(`/tournament/${tid}`, { replace: true });
    }
  }, [navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value.slice(0, 1);
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
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

  const onPinEntered = (joined) => {
    switch (joined) {
      case "2101":
        selectTournament(21);
        break;
      case "2104":
        selectTournament(24);
        break;
      case "2103":
        selectTournament(23);
        break;
      case "7172":
        selectTournament(20);
        break;
      case "9191":
        selectTournament(1);
        break;
      default:
        setPin(["", "", "", ""]);
        setMessage("Invalid pin! " + joined);
        inputsRef.current[0].focus();
        setTimeout(() => {
          setMessage("");
        }, 2000);
        break;
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
        return <div className="pinLogin">No active tournaments found.</div>;
    }

    return (
      <div className="tournamentList">
        {availableTournaments.map((t) => (
          <div key={t.Id} className="tournamentCard" onClick={() => setSelectedTournament(t)}>
            <h3>{t.Title}</h3>
            {/* Display date only if it exists */}
            {t.Date && <p>{new Date(t.Date).toLocaleDateString()}</p>}
            {/* Display location only if it exists */}
            {t.Location && <p>{t.Location}</p>}
          </div>
        ))}
      </div>
    );
  }

  // Focus first input when PIN entry becomes visible
  useEffect(() => {
    if (selectedTournament) {
      inputsRef.current[0]?.focus();
    }
  }, [selectedTournament]);

  return (
    <div className="pinLogin">
      {/* Back button to return to tournament selection */}
      <button onClick={() => setSelectedTournament(null)} style={{ position: 'absolute', top: '20px', left: '20px' }}>
        &larr; Back
      </button>
      <h2>{selectedTournament.Title}</h2>
      <div style={{ textAlign: "center" }}>{t("pinLogin_enter_pin")}</div>
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
      <div>&nbsp;{message}&nbsp;</div>
      <div>{`Pitch Perfect v${versionInfo?.mobile}`}</div>
    </div>
  );
};

export default PinLogin;
