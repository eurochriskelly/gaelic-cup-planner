import './CardButton.scss';

const CardButton = ({ type, onClick, active }) => {
  const buttonClass = `card-button ${type.toLowerCase()} ${active ? 'active' : ''}`;
  return (
    <button
      className={buttonClass.trim()}
      onClick={onClick}
    >
      {type}
    </button>
  );
};

export default CardButton;
