import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../shared/js/Provider";
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

  // static tournament data until we fetch from endpoint
  const tournaments = [
    { Id: 1, Date: "2029-12-31T23:00:00.000Z", Title: "Sandbox tournament 2030", Location: "Eurodisney, Paris", eventUuid: "7bd2ad30-f6aa-11ef-a162-23d9aafc1469" },
    { Id: 2, Date: "2024-10-05T22:00:00.000Z", Title: "Euro Hurling and Camogie Finals 2024", Location: "Eindhoven, The Mew Netherlands, Mars", eventUuid: null },
    { Id: 3, Date: "2023-08-08T22:00:00.000Z", Title: "Pan Euros", Location: "The Hague, The Netherlands", eventUuid: "7d6eab76-f6aa-11ef-9949-ef7f53e6d970" }
  ];
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    inputsRef.current[0]?.focus();
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
    return (
      <div className="tournamentList">
        {tournaments.map((t) => (
          <div key={t.Id} className="tournamentCard" onClick={() => setSelectedTournament(t)}>
            <h3>{t.Title}</h3>
            <p>{new Date(t.Date).toLocaleDateString()}</p>
            <p>{t.Location}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pinLogin">
      <button onClick={() => setSelectedTournament(null)}>Back to tournaments</button>
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
