import { useState } from "react";
// Removed React import - rely on JSX transform
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
 
  return (
    <div className="ListCardedPlayers">
      {!recordCards && (
        <div className="card-question" style={{marginTop:'150px'}}>
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
              <tr>
                <td>{team1.toUpperCase()}</td>
                <td style={{minWidth: '370px'}}>
                  {/* Container for Team 1's add card buttons */}
                  {/* Only show R/Y/B buttons if NO unconfirmed row exists ANYWHERE */}
                  {!isAnyRowUnconfirmed() && (
                    <div className="card-buttons add-card-buttons-team1">
                      <CardButton type="R" onClick={() => actions.addCard(team1, 'red')} />
                      <CardButton type="Y" onClick={() => actions.addCard(team1, 'yellow')} />
                      <CardButton type="B" onClick={() => actions.addCard(team1, 'black')} />
                    </div>
                  )}
                </td>
              </tr>
              {cardedPlayersTeam1.length > 0 && (
                <tr>
                  <td colSpan="2">
                    <table className="card-sub-table">
                      <tbody>
                        {cardedPlayersTeam1.map(card => (
                          <React.Fragment key={card.id}>
                            <tr>
                            <td style={{width: '70px'}}><div className={`card-color ${card.cardType}`}></div></td>
                            {/* Input for player number (Team 1) */}
                            <td style={{width: '70px'}}><input
                              type="number"
                              placeholder="#"
                              className="player-number-input player-number-input-team1"
                              value={card.number}
                              onChange={(e) => actions.updateCard(team1, card.id, 'number', e.target.value)}
                              // removed disabled={card.confirmed}
                            /></td>
                            {/* Input for player name (Team 1) */}
                            <td width={{width:'auto'}}><input
                              type="text"
                              placeholder="player name required"
                              className="player-name-input player-name-input-team1"
                              value={card.name}
                              onChange={(e) => actions.updateCard(team1, card.id, 'name', e.target.value.toUpperCase())}
                              // removed disabled={card.confirmed}
                            /></td>
                            {/* Clickable icon to remove card entry (Team 1) */}
                            <td style={{width: '70px', textAlign: 'center', verticalAlign: 'middle'}}> {/* Center the icon */}
                              <i
                                className="pi pi-minus-circle remove-card-icon remove-card-icon-team1" // Use icon class
                                onClick={() => actions.removeCard(team1, card.id)} // Move onClick here
                                title="Remove Card" // Add title for accessibility
                              ></i>
                            </td>
                          </tr>
                          {/* Row for Add button, only shown if card is not confirmed */}
                          {!card.confirmed && (
                            <tr key={`${card.id}-add`}>
                              <td colSpan="4" style={{ padding: '5px 0' }}>
                                <button
                                  className="confirm-full-width-button confirm-full-width-button-team1"
                                  onClick={() => actions.confirmCard(team1, card.id)}
                                >
                                  <i className="pi pi-plus-circle"></i> {/* Add PrimeIcon */}
                                  <span>Add Carded Player</span> {/* Wrap text in span if needed */}
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
              <tr>
                <td>{team2.toUpperCase()}</td>
                <td>
                  {/* Container for Team 2's add card buttons */}
                  {/* Only show R/Y/B buttons if NO unconfirmed row exists ANYWHERE */}
                  {!isAnyRowUnconfirmed() && (
                    <div className="card-buttons add-card-buttons-team2">
                      <CardButton type="R" onClick={() => actions.addCard(team2, 'red')} />
                      <CardButton type="Y" onClick={() => actions.addCard(team2, 'yellow')} />
                      <CardButton type="B" onClick={() => actions.addCard(team2, 'black')} />
                    </div>
                  )}
                </td>
              </tr>
              {cardedPlayersTeam2.length > 0 && (
                <tr>
                  <td colSpan="2">
                    <table className="card-sub-table">
                      <tbody>
                        {cardedPlayersTeam2.map(card => (
                          <React.Fragment key={card.id}>
                            <tr>
                            <td style={{width: '70px'}}><div className={`card-color ${card.cardType}`}></div></td>
                            {/* Input for player number (Team 2) */}
                            <td style={{width: '70px'}}><input
                              type="number"
                              placeholder="#"
                              className="player-number-input player-number-input-team2"
                              value={card.number}
                              onChange={(e) => actions.updateCard(team2, card.id, 'number', e.target.value)}
                              // removed disabled={card.confirmed}
                            /></td>
                            {/* Input for player name (Team 2) */}
                            <td style={{width: 'auto'}}><input
                              type="text"
                              placeholder="player name required"
                              className="player-name-input player-name-input-team2"
                              value={card.name}
                              onChange={(e) => actions.updateCard(team2, card.id, 'name', e.target.value.toUpperCase())}
                              // removed disabled={card.confirmed}
                            /></td>
                            {/* Clickable icon to remove card entry (Team 2) */}
                            <td style={{width: '70px', textAlign: 'center', verticalAlign: 'middle'}}> {/* Center the icon */}
                              <i
                                className="pi pi-minus-circle remove-card-icon remove-card-icon-team2" // Use icon class
                                onClick={() => actions.removeCard(team2, card.id)} // Move onClick here
                                title="Remove Card" // Add title for accessibility
                              ></i>
                            </td>
                          </tr>
                          {/* Row for Add button, only shown if card is not confirmed */}
                          {!card.confirmed && (
                            <tr key={`${card.id}-add`}>
                              <td colSpan="4" style={{ padding: '5px 0' }}>
                                <button
                                  className="confirm-full-width-button confirm-full-width-button-team2"
                                  onClick={() => actions.confirmCard(team2, card.id)}
                                >
                                  <i className="pi pi-plus-circle"></i> {/* Add PrimeIcon */}
                                  <span>Add Carded Player</span> {/* Wrap text in span if needed */}
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
