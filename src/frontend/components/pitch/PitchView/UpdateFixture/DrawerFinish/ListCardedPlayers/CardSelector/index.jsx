import { useState } from "react";
import "./CardSelector.scss"; // Make sure to create this CSS file

const CardSelector = ({ onCard = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");

  const cardTypes = [
    { color: "yellow", label: "Yellow Card" },
    { color: "red", label: "Red Card" },
    { color: "black", label: "Black Card" },
  ];

  const toggleDropdown = () => {
    console.log('here')
    setIsOpen(!isOpen);
  }

  const selectCard = (color) => {
    setSelectedColor(color);
    setIsOpen(false);
    onCard(color);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-selector" onClick={toggleDropdown}>
        {selectedColor ? (
          <div className={`color-box ${selectedColor}`}></div>
        ) : (
          <div className="placeholder">
            Choose
            <br />
            Card
            <br />
            Type
          </div>
        )}
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {cardTypes.map((card, index) => (
            <div
              key={index}
              className={`color-box ${card.color}`}
              onClick={() => selectCard(card.color)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardSelector;
