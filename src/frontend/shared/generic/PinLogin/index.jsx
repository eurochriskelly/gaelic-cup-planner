import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import Cookies from "js-cookie";
import "./PinLogin.scss";

const PinLogin = () => {
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

  const selectTournament = (page, id) => {
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
        selectTournament("selectPitch", 9);
        break;
      case "A1JN":
      case "1976":
      case "5400":
        selectTournament("selectCategory", 9);
        break;
      case "1010":
        selectTournament("selectCategory", 10);
        break;
      case "9999":
        selectTournament("selectCategory", 1);
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
      <div>Enter 4-digit tournament code</div>
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
      <div>{
        `GaelicGale v${versionInfo?.mobile}`
      }</div>
    </div>
  );
};

export default PinLogin;
