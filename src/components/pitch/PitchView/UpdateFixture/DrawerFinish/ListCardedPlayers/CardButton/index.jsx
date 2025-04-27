import './CardButton.scss';

// Add 'active' prop
const CardButton = ({ type, onClick, active }) => {
  // Add 'active' class conditionally
  const buttonClass = `card-button ${type.toLowerCase()} ${active ? 'active' : ''}`;

  return (
    <button
      className={buttonClass.trim()} // Use the updated class string, trim potential trailing space
      style={{ minWidth: '70px', minHeight: '100px', margin: '7px' }}
      onClick={onClick}>
      {/* Display the card type (R, Y, B) instead of '+' */}
      {type}
    </button>
  );
};

export default CardButton;
