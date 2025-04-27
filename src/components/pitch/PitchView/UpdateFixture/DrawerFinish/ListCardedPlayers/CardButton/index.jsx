import './CardButton.scss';

const CardButton = ({ type, onClick }) => { // Remove isAddButton prop
  const buttonClass = `card-button ${type.toLowerCase()}`; // Revert class logic

  return (
    <button
      className={buttonClass} // Use the original class string
      style={{minWidth: '95px', minHeight: '100px'}}
      onClick={onClick}>
      +
    </button>
  );
};

export default CardButton;
