import { useState } from "react";
import API from "../../../../../../shared/api/endpoints";
import CardButton from "./CardButton";
import './TabCards.scss';

const TabCards = ({ 
  team1, 
  team2, 
  cardedPlayers, 
  setCardedPlayers,
  fixture,
  onClose
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    team: team1,
    cardColor: 'red',
    playerNumber: '',
    playerName: ''
  });

  const handleSaveCards = () => {
    const playersToUpdate = [
      ...cardedPlayers.team1,
      ...cardedPlayers.team2,
    ];
    
    API.updateCardedPlayers(fixture.tournamentId, fixture.id, playersToUpdate)
      .then(() => {
        console.log("Successfully updated carded players");
        onClose();
      })
      .catch(error => {
        console.error("Error updating carded players:", error);
      });
  };

  const actions = {
    addOrUpdateCard: () => {
      if (!formData.playerNumber) {
        alert('Player number is required.');
        return;
      }
      const card = {
        id: editingCard ? editingCard.id : Date.now(),
        team: formData.team,
        cardColor: formData.cardColor,
        playerNumber: formData.playerNumber,
        playerName: formData.playerName || 'Not provided',
        confirmed: true
      };
      const teamKey = formData.team === team1 ? 'team1' : 'team2';
      if (editingCard) {
        setCardedPlayers(prev => ({
          ...prev,
          [teamKey]: prev[teamKey].map(c => c.id === card.id ? card : c)
        }));
      } else {
        setCardedPlayers(prev => ({
          ...prev,
          [teamKey]: [...prev[teamKey], card]
        }));
      }
      resetForm();
    },
    removeCard: (team, id) => {
      const teamKey = team === team1 ? 'team1' : 'team2';
      setCardedPlayers(prev => ({
        ...prev,
        [teamKey]: prev[teamKey].filter(card => card.id !== id)
      }));
    },
    editCard: (card) => {
      setEditingCard(card);
      setFormData({
        team: card.team,
        cardColor: card.cardColor,
        playerNumber: card.playerNumber,
        playerName: card.playerName === 'Not provided' ? '' : card.playerName
      });
      setShowForm(true);
    },
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCard(null);
    setFormData({ team: team1, cardColor: 'red', playerNumber: '', playerName: '' });
  };

  const renderCardForm = () => (
    <div className="card-form-overlay">
      <div className="card-form AscendantPanel">
        <h3>{editingCard ? 'Edit Carded Player' : 'Add Carded Player'}</h3>
        <div className="form-group">
          <label>Team</label>
          <span className="selected-team-display">{formData.team}</span>
        </div>
        <div className="form-group">
          <label>Card Type</label>
          <div className="card-type-selection">
            <CardButton type="R" onClick={() => setFormData({ ...formData, cardColor: 'red' })} active={formData.cardColor === 'red'} />
            <CardButton type="Y" onClick={() => setFormData({ ...formData, cardColor: 'yellow' })} active={formData.cardColor === 'yellow'} />
            <CardButton type="B" onClick={() => setFormData({ ...formData, cardColor: 'black' })} active={formData.cardColor === 'black'} />
          </div>
        </div>
        <div className="form-group">
          <label>Player Number</label>
          <input
            type="number"
            value={formData.playerNumber}
            onChange={(e) => setFormData({ ...formData, playerNumber: e.target.value })}
            placeholder="Enter player number"
            required
          />
        </div>
        <div className="form-group">
          <label>Player Name (Optional)</label>
          <input
            type="text"
            value={formData.playerName}
            style={{ textTransform: 'uppercase' }}
            onChange={(e) => setFormData({ ...formData, playerName: e.target.value.toUpperCase() })}
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
              <div className={`card-indicator card-${card.cardColor}`}>
                [{card.cardColor.charAt(0).toUpperCase()}]
              </div>
              <span className="card-number">#{card.playerNumber}</span>
              <span className="card-name">{card.playerName}</span>
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
    <div className="TabCards">
      {showForm ? (
        renderCardForm()
      ) : (
        <div className="card-content">
          {renderTeamSection(team1, cardedPlayers.team1, 'team1')}
          {renderTeamSection(team2, cardedPlayers.team2, 'team2')}
          <div className="card-actions">
            <button className="cancel-button" onClick={onClose}>
              <i className="pi pi-times"></i> Cancel
            </button>
            <button className="save-button" onClick={handleSaveCards}>
              <i className="pi pi-check"></i> Save Cards
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabCards;
