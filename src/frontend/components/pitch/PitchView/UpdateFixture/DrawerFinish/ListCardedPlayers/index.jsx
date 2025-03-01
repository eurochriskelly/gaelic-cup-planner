import { useState } from "react";
import CardButton from "./CardButton";
import './ListCardedPlayers.scss';

const ListCardedPlayers = ({ team1, team2, onProceed = () => {}, onClose = () => {} }) => {
  const [recordCards, setRecordCards] = useState(false);
  const [cardedPlayersTeam1, setCardedPlayersTeam1] = useState([]);
  const [cardedPlayersTeam2, setCardedPlayersTeam2] = useState([]);

  const actions = {
    addCard: (team, cardType) => {
      const newCard = { id: Date.now(), team, cardType, number: '', name: '' };
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
    isAddDisabled: (team) => {
      const teamCards = team === team1 ? cardedPlayersTeam1 : cardedPlayersTeam2;
      return teamCards.some(card => !card.number); // Disable if any card lacks number
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

  return (
    <div className="ListCardedPlayers">
      {!recordCards && (
        <div className="card-question" style={{marginTop:'150px'}}>
          <h3>Do you want to record any carded players?</h3>
          <div className="toggle">
            <button className={recordCards ? "no" : "yes active"} onClick={() => { setRecordCards(false); onClose(); onProceed([]); }}>No</button>
            <button className={recordCards ? "yes active" : "no"} onClick={() => setRecordCards(true)}>Yes</button>
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
                  <div className="card-buttons">
                    <CardButton type="R" onClick={() => actions.addCard(team1, 'red')} disabled={actions.isAddDisabled(team1)} />
                    <CardButton type="Y" onClick={() => actions.addCard(team1, 'yellow')} disabled={actions.isAddDisabled(team1)} />
                    <CardButton type="B" onClick={() => actions.addCard(team1, 'black')} disabled={actions.isAddDisabled(team1)} />
                  </div>
                </td>
              </tr>
              {cardedPlayersTeam1.length > 0 && (
                <tr>
                  <td colSpan="2">
                    <table className="card-sub-table">
                      <tbody>
                        {cardedPlayersTeam1.map(card => (
                          <tr key={card.id}>
                            <td style={{width: '70px'}}><div className={`card-color ${card.cardType}`}></div></td>
                            <td style={{width: '70px'}}><input
                              type="number"
                              placeholder="#"
                              value={card.number}
                              onChange={(e) => actions.updateCard(team1, card.id, 'number', e.target.value)}
                            /></td>
                            <td width={{width:'auto'}}><input
                              type="text"
                              placeholder="Player Name"
                              value={card.name}
                              onChange={(e) => actions.updateCard(team1, card.id, 'name', e.target.value.toUpperCase())}
                            /></td>
                            <td style={{width: '70px'}}><button style={{width: '60px', minWidth: '90px'}} onClick={() => actions.removeCard(team1, card.id)}>-</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
              <tr>
                <td>{team2.toUpperCase()}</td>
                <td>
                  <div className="card-buttons">
                    <CardButton type="R" onClick={() => actions.addCard(team2, 'red')} disabled={actions.isAddDisabled(team2)} />
                    <CardButton type="Y" onClick={() => actions.addCard(team2, 'yellow')} disabled={actions.isAddDisabled(team2)} />
                    <CardButton type="B" onClick={() => actions.addCard(team2, 'black')} disabled={actions.isAddDisabled(team2)} />
                  </div>
                </td>
              </tr>
              {cardedPlayersTeam2.length > 0 && (
                <tr>
                  <td colSpan="2">
                    <table className="card-sub-table">
                      <tbody>
                        {cardedPlayersTeam2.map(card => (
                          <tr key={card.id}>
                            <td style={{width: '70px'}}><div className={`card-color ${card.cardType}`}></div></td>
                            <td style={{width: '70px'}}><input
                              type="number"
                              placeholder="#"
                              value={card.number}
                              onChange={(e) => actions.updateCard(team2, card.id, 'number', e.target.value)}
                            /></td>
                            <td style={{width: 'auto'}}><input
                              type="text"
                              placeholder="Player Name"
                              value={card.name}
                              onChange={(e) => actions.updateCard(team2, card.id, 'name', e.target.value.toUpperCase())}
                            /></td>
                            <td style={{width: '70px'}}><button style={{width: '60px', minWidth: '90px'}} onClick={() => actions.removeCard(team2, card.id)}>Remove</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="card-actions">
            <button 
              className="ok"
              onClick={onProceed.bind(null, actions.formatCards([...cardedPlayersTeam1, ...cardedPlayersTeam2]))}
            >
              OK
            </button>
            <button 
              className="cancel"
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
