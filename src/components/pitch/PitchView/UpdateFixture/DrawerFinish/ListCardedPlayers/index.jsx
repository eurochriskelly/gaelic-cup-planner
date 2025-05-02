import { useState } from "react";
import CardButton from "./CardButton";
import './ListCardedPlayers.scss';
     
const ListCardedPlayers = ({ team1, team2, onProceed = () => {}, onClose = () => {} }) => {
  const [recordCards, setRecordCards] = useState(false);
  const [cardedPlayersTeam1, setCardedPlayersTeam1] = useState([]);
  const [cardedPlayersTeam2, setCardedPlayersTeam2] = useState([]);

  const actions = {
    addCard: (team, cardType) => {
      const newCard = { id: Date.now(), team, cardType, number: '', name: '', confirmed: false }; // Add confirmed state
      if (team === team1) {
        setCardedPlayersTeam1([...cardedPlayersTeam1, newCard]);
      } else {
        setCardedPlayersTeam2([...cardedPlayersTeam2, newCard]);
      }
    },
    updateCard: (team, id, field, value) => {
      const updateTeam = team === team1 ? setCardedPlayersTeam1 : setCardedPlayersTeam2;
      updateTeam(prev => prev.map(card => 
        card.id === id ? { ...card, [field]: value } : card
      ));
    },
    removeCard: (team, id) => {
      const updateTeam = team === team1 ? setCardedPlayersTeam1 : setCardedPlayersTeam2;
      updateTeam(prev => prev.filter(card => card.id !== id));
    },
    confirmCard: (team, id) => {
      const teamCards = team === team1 ? cardedPlayersTeam1 : cardedPlayersTeam2;
      const cardToConfirm = teamCards.find(card => card.id === id);

      if (!cardToConfirm.number) {
        alert('Player number is required.'); // Or handle error more gracefully
        return;
      }

      const finalName = cardToConfirm.name || 'Not provided';
      const updateTeam = team === team1 ? setCardedPlayersTeam1 : setCardedPlayersTeam2;

      updateTeam(prev => prev.map(card =>
        card.id === id ? { ...card, name: finalName, confirmed: true } : card
      ));
    },
    formatCards: (cards) => {
      return cards.map(card => ({
        playerId: card.number,
        cardColor: card.cardType,
        playerName: card.name,
        team: card.team,
      }));
    },
  };
 
  // Check if any card row across both teams is unconfirmed
  const isAnyRowUnconfirmed = () => {
    const allCards = [...cardedPlayersTeam1, ...cardedPlayersTeam2];
    return allCards.some(card => !card.confirmed);
  };
 
  // Function to render a team's card section (add buttons & subtable)
  const renderTeamSection = (team, cards, suffix) => (
    <>
      <tr key={`${suffix}-add-buttons`}>
        <td>{team.toUpperCase()}</td>
        <td style={suffix === 'team1' ? { minWidth: '370px' } : undefined}>
          {!isAnyRowUnconfirmed() && (
            <div className={`card-buttons add-card-buttons-${suffix}`}>
              <CardButton type="R" onClick={() => actions.addCard(team, 'red')} />
              <CardButton type="Y" onClick={() => actions.addCard(team, 'yellow')} />
              <CardButton type="B" onClick={() => actions.addCard(team, 'black')} />
            </div>
          )}
        </td>
      </tr>
      {!!cards.length && (
        <tr key={`${suffix}-subtable`}>
          <td colSpan="2">
            <table className="card-sub-table">
              <tbody>
                {cards.map(card => (
                  <React.Fragment key={card.id}>
                    <tr className="card-row">
                      <td style={{ width: suffix === 'team1' ? '60px' : '70px' }}>
                        <div className={`card-color ${card.cardType}`}></div>
                      </td>
                      <td style={{ width: '70px' }}>
                        <input
                          type="number"
                          placeholder="#"
                          className={`player-number-input player-number-input-${suffix}`}
                          value={card.number}
                          onChange={e => actions.updateCard(team, card.id, 'number', e.target.value)}
                        />
                      </td>
                      <td style={{ width: 'auto' }}>
                        <input
                          type="text"
                          placeholder="player name required"
                          className={`player-name-input player-name-input-${suffix}`}
                          value={card.name}
                          onChange={e => actions.updateCard(team, card.id, 'name', e.target.value.toUpperCase())}
                        />
                      </td>
                      <td style={{ width: '70px', textAlign: 'center', verticalAlign: 'middle' }}>
                        <i
                          className={`pi pi-minus-circle remove-card-icon remove-card-icon-${suffix}`}
                          onClick={() => actions.removeCard(team, card.id)}
                          title="Remove Card"
                        ></i>
                      </td>
                    </tr>
                    {!card.confirmed && (
                      <tr key={`${card.id}-add`}>
                        <td colSpan="4" style={{ padding: '5px 0' }}>
                          <button
                            className={`confirm-full-width-button confirm-full-width-button-${suffix}`}
                            onClick={() => actions.confirmCard(team, card.id)}
                          >
                            <i className="pi pi-plus-circle"></i>
                            <span>Add Carded Player</span>
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );

  return (
    <div className="ListCardedPlayers">
      {!recordCards && (
        <div className="card-question" style={{ marginTop: '150px' }}>
          <h3 className="text-8xl">Do you want to record any carded players?</h3>
          <div className="toggle">
            {/* Button to decline recording cards */}
            <button className={`decline-record-cards ${recordCards ? "no" : "yes active"}`} onClick={() => { setRecordCards(false); onClose(); onProceed([]); }}>No</button>
            {/* Button to confirm recording cards */}
            <button className={`confirm-record-cards ${recordCards ? "yes active" : "no"}`} onClick={() => setRecordCards(true)}>Yes</button>
          </div>
        </div>
      )}
      {recordCards && (
        <>
          <table className="card-table">
            <thead>
              <tr>
                <th>Add card for team</th>
                <th>Card type</th>
              </tr>
            </thead>
            <tbody>
              {renderTeamSection(team1, cardedPlayersTeam1, 'team1')}
              {renderTeamSection(team2, cardedPlayersTeam2, 'team2')}
            </tbody>
          </table>
          <div className="card-actions">
            {/* Button to confirm and proceed with entered cards */}
            <button
              className="ok confirm-card-entries"
              onClick={onProceed.bind(null, actions.formatCards([...cardedPlayersTeam1, ...cardedPlayersTeam2]))}
              disabled={isAnyRowUnconfirmed()} // Disable if any row is unconfirmed
            >
              OK
            </button>
            {/* Button to cancel card entry and go back */}
            <button
              className="cancel cancel-card-entry"
              onClick={() => setRecordCards(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListCardedPlayers;
