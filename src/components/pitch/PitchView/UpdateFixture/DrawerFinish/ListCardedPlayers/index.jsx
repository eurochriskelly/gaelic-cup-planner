import { useState } from "react";
import CardButton from "./CardButton";
import './ListCardedPlayers.scss';

const ListCardedPlayers = ({ team1, team2, onProceed = () => {}, onClose = () => {} }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardedPlayersTeam1, setCardedPlayersTeam1] = useState([]);
  const [cardedPlayersTeam2, setCardedPlayersTeam2] = useState([]);
  const [formData, setFormData] = useState({
    team: team1,
    cardType: 'red',
    number: '',
    name: ''
  });

  const actions = {
    addOrUpdateCard: () => {
      if (!formData.number) {
        alert('Player number is required.');
        return;
      }
      const card = {
        id: editingCard ? editingCard.id : Date.now(),
        team: formData.team,
        cardType: formData.cardType,
        number: formData.number,
        name: formData.name || 'Not provided',
        confirmed: true
      };
      const updateTeam = formData.team === team1 ? setCardedPlayersTeam1 : setCardedPlayersTeam2;
      if (editingCard) {
        updateTeam(prev => prev.map(c => c.id === card.id ? card : c));
      } else {
        updateTeam(prev => [...prev, card]);
      }
      resetForm();
    },
    removeCard: (team, id) => {
      const updateTeam = team === team1 ? setCardedPlayersTeam1 : setCardedPlayersTeam2;
      updateTeam(prev => prev.filter(card => card.id !== id));
    },
    editCard: (card) => {
      setEditingCard(card);
      setFormData({
        team: card.team,
        cardType: card.cardType,
        number: card.number,
        name: card.name === 'Not provided' ? '' : card.name
      });
      setShowForm(true);
    },
    formatCards: (cards) => cards.map(card => ({
      playerId: card.number,
      cardColor: card.cardType,
      playerName: card.name,
      team: card.team
    }))
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCard(null);
    setFormData({ team: team1, cardType: 'red', number: '', name: '' });
  };

  const renderCardForm = () => (
    <div className="card-form-overlay">
      <div className="card-form AscendantPanel">
        <h3>{editingCard ? 'Edit Carded Player' : 'Add Carded Player'}</h3>
        {/* Display the selected team instead of radio buttons */}
        <div className="form-group">
          <label>Team</label>
          <span className="selected-team-display">{formData.team}</span> {/* Display the team name */}
        </div>
        <div className="form-group">
          <label>Card Type</label>
          <div className="card-type-selection">
            <CardButton type="R" onClick={() => setFormData({ ...formData, cardType: 'red' })} active={formData.cardType === 'red'} />
            <CardButton type="Y" onClick={() => setFormData({ ...formData, cardType: 'yellow' })} active={formData.cardType === 'yellow'} />
            <CardButton type="B" onClick={() => setFormData({ ...formData, cardType: 'black' })} active={formData.cardType === 'black'} />
          </div>
        </div>
        <div className="form-group">
          <label>Player Number</label>
          <input
            type="number"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            placeholder="Enter player number"
            required
          />
        </div>
        <div className="form-group">
          <label>Player Name (Optional)</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
            placeholder="Enter player name"
          />
        </div>
        <div className="form-actions">
          <button className="cancel-button" onClick={resetForm}>
            <i className="pi pi-times"></i> Cancel
          </button>
          <button className="save-button" onClick={actions.addOrUpdateCard}>
            <i className="pi pi-check"></i> {editingCard ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderTeamSection = (team, cards, suffix) => (
    <div className={`team-section team-${suffix}`}>
      <div className="team-header">
        <h4>Team: {team}</h4>
        {!showForm && (
          <button
            className="add-card-button"
            onClick={() => {
              setFormData({ ...formData, team });
              setShowForm(true);
            }}
          >
            <i className="pi pi-plus"></i> Add Card
          </button>
        )}
      </div>
      {cards.length > 0 ? (
        <div className="cards-list">
          {cards.map(card => (
            <div key={card.id} className="card-entry">
              <div className={`card-indicator card-${card.cardType}`}>
                [{card.cardType.charAt(0).toUpperCase()}]
              </div>
              <span className="card-number">#{card.number}</span>
              <span className="card-name">{card.name}</span>
              <div className="card-actions">
                <i
                  className="pi pi-minus-circle remove-icon"
                  onClick={() => actions.removeCard(team, card.id)}
                  title="Remove Card"
                ></i>
                <i
                  className="pi pi-pencil edit-icon"
                  onClick={() => actions.editCard(card)}
                  title="Edit Card"
                ></i>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-cards">No cards recorded for this team.</p>
      )}
    </div>
  );

  return (
    <div className="ListCardedPlayers">
      {showForm ? (
        renderCardForm()
      ) : (
        <div className="card-content">
          {renderTeamSection(team1, cardedPlayersTeam1, 'team1')}
          {renderTeamSection(team2, cardedPlayersTeam2, 'team2')}
          <div className="card-actions">
            <button
              className="proceed-button"
              onClick={() => onProceed(actions.formatCards([...cardedPlayersTeam1, ...cardedPlayersTeam2]))}
            >
              <i className="pi pi-check-circle"></i> Proceed
            </button>
            <button className="cancel-button" onClick={onClose}>
              <i className="pi pi-times-circle"></i> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCardedPlayers;

