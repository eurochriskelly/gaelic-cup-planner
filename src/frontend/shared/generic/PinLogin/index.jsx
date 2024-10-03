import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../shared/js/Provider";
import Cookies from "js-cookie";
import LanguageSwitcher from "../LanguageSwitcher";
import "./PinLogin.scss";

const PinLogin = () => {
  const { t } = useTranslation();
  const { setupTournament, versionInfo } = useAppContext();
  const navigate = useNavigate();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [isThinking, setIsThinking] = useState(false);
  const [message, setMessage] = useState("");
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0].focus();
  }, [])

  const handleChange = (e, index) => {
    const value = e.target.value.slice(0, 1); // Only allow one digit
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    // Auto-tab to the next input
    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
    // Check if all inputs have values
    if (newPin.every((num) => num !== "")) {
      const joined = newPin.join("");
      onPinEntered(joined);
    }
  };

  const selectTournament = (id) => {
    setupTournament(id);
    setIsThinking(true);
    setTimeout(() => {
      setPin(["#", "#", "#", "#"]);
      setTimeout(() => {
        navigate(`/tournament/${id}`);
        setIsThinking(false);
      }, 500)
    })
  };
  const onPinEntered = (joined) => {
    switch (joined) {
      case "XGG7":
      case "1975":
      case "1091":
        selectTournament(9);
        break;
      case "A1JN":
      case "1976":
      case "5400":
        selectTournament(9);
        break;
      case "1010":
        selectTournament(10);
        break;
      case "7465":
        selectTournament(13);
        break;
      case "9999":
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

  return (
    <div className="pinLogin">
      <div style={{textAlign: 'center'}}>{t('pinLogin_enter_pin')}</div>
      <div className="pinContainer">
        {pin.map((num, index) => (
          <input
            className={isThinking ? 'thinking' : ''}
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            value={num}
            onChange={(e) => handleChange(e, index)}
            maxLength="1"
          />
        ))}
      </div>
      <div>&nbsp;{message}&nbsp;</div>
      <LanguageSwitcher />
      <div>{
        `Pitch Perfect v${versionInfo?.mobile}`
      }</div>
    </div>
  );
};

export default PinLogin;
