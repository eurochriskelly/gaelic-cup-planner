import ListCardedPlayers from "./ListCardedPlayers";
import './TabCards.scss';

const TabCards = ({ cardedPlayers, setCardedPlayers, fixture, onProceed, onClose }) => {
  return (
    <ListCardedPlayers
      team1={fixture.team1}
      team2={fixture.team2}
      cardedPlayers={cardedPlayers}
      setCardedPlayers={setCardedPlayers}
      onProceed={onProceed}
      onClose={onClose}
    />
  );
};

export default TabCards;
