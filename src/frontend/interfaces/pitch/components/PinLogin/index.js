import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './PinLogin.css';

const PinLogin = () => {
    const navigate = useNavigate();
    const [pin, setPin] = useState(["", "", "", ""]);
    const [message, setMessage] = useState("");
    const inputsRef = useRef([]);

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
        if (newPin.every(num => num !== "")) {
            const joined = newPin.join("");
            onPinEntered(joined);
        }
    };

    const onPinEntered = (joined) => {
        switch (joined) {
            case '1237':
                navigate(`/tournament/7`);
                break;
            case '1238':
                navigate(`/tournament/8`);
                break;
            default:
                console.log('bad pin')
                // reset pin
                setPin(["", "", "", ""]);
                setMessage("Invalid pin!");
                setTimeout(() => {
                    setMessage("");
                }, 2000);
                break;
        }
    };

    return (
        <div className='pinLogin'>
            <div>Enter 4-digit pin received by email</div>
            <div className='pinContainer'>
                {pin.map((num, index) => (
                    <input
                        key={index}
                        ref={el => inputsRef.current[index] = el}
                        type="number"
                        value={num}
                        onChange={(e) => handleChange(e, index)}
                        maxLength="1"
                    />
                ))}
            </div>
            <div>&nbsp;{message}&nbsp;</div>
        </div>
    );
};

export default PinLogin;