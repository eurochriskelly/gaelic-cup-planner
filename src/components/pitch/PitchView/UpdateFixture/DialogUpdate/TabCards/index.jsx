import ListCardedPlayers from "./ListCardedPlayers";
import './TabCards.scss';

const TabCards = ({ cardedPlayers, setCardedPlayers, fixture, onProceed, onClose }) => {
  return (
    <div className="drawerFinish">
      <div className="drawer-header">Card Players</div>
      <div className="drawer-container">
        <ListCardedPlayers
          team1={fixture.team1}
          team2={fixture.team2}
          cardedPlayers={cardedPlayers}
          setCardedPlayers={setCardedPlayers}
          onProceed={onProceed}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default TabCards;

