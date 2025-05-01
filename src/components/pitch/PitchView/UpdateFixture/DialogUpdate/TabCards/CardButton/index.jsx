import './CardButton.scss';

const CardButton = ({ type, onClick, active }) => {
  const buttonClass = `card-button ${type.toLowerCase()} ${active ? 'active' : ''}`;
  return (
    <button
      className={buttonClass.trim()}
      style={{ minWidth: '70px', minHeight: '100px', margin: '7px' }}
      onClick={onClick}
    >
      {type}
    </button>
  );
};

export default CardButton;
