import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../shared/js/Provider";
import LanguageSwitcher from "../LanguageSwitcher";
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

  useEffect(() => {
    inputsRef.current[0].focus();
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

  return (
    <div className="pinLogin">
      <div style={{ textAlign: "center" }}>{t("pinLogin_enter_pin")}</div>
      <div className="pinContainer">
        {pin.map((num, index) => (
          <input
            className={isThinking ? "thinking" : ""}
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
      <div>{`Pitch Perfect v${versionInfo?.mobile}`}</div>
    </div>
  );
};

export default PinLogin;
