import './CardButton.scss';

const CardButton = ({ type, onClick }) => {
  return (
    <button
      className={`card-button ${type.toLowerCase()}`}
      style={{minWidth: '95px', minHeight: '100px'}}
      onClick={onClick}>
      +
    </button>
  );
};

export default CardButton;
