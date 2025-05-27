import { useState } from "react";
// API import removed, as parent will handle API calls
import CardButton from "./CardButton";
import './TabCards.scss';

const TabCards = ({ 
  team1, 
  team2, 
  cardedPlayers, 
  setCardedPlayer, // This will update the state in CardEntryWrapper
  fixture // fixture might still be needed for context, e.g. tournamentId, fixture.id if API was here
  // onSaveComplete and onCancel props removed
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    team: team1,
    cardColor: 'red',
    playerNumber: '',
    playerName: ''
  });

  // handleSaveCards function (previously handleSaveCardsAndClose) is removed as API call moves to parent.

  const actions = {
    addOrUpdateCard: () => {
      if (!formData.playerNumber) {
        alert('Player number is required.');
        return;
      }
      // no id means new card 
      const card = {
        id: editingCard ? editingCard.id : null, 
        team: formData.team,
        cardColor: formData.cardColor,
        playerNumber: parseInt(formData.playerNumber, 10), // Ensure number
        playerName: formData.playerName || 'Not provided',
        confirmed: true // Assuming cards added this way are confirmed
      };
      setCardedPlayer(card); // This updates the state in CardEntryWrapper
      resetForm();
    },
    removeCard: (team, id) => {
      setCardedPlayer({ id, team, action: 'delete' });
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
          <label>Player Name</label>
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
      {/* Ensure cards is an array before mapping */}
      {(cards || []).length > 0 ? (
        <div className="cards-list">
          {(cards || []).map(card => ( // Check if card.id exists
            <div key={card.id || `temp-${card.playerNumber}-${card.team}`} className="card-entry">
              <div className={`card-indicator card-${card.cardColor}`}>
                {/* Ensure cardColor exists */}
                {card.cardColor ? card.cardColor.charAt(0).toUpperCase() : ''}
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
 console.log('eee', cardedPlayers)
  return (
    <div className="TabCards">
      {showForm ? (
        renderCardForm()
      ) : (
        <div className="card-content">
          {renderTeamSection(team1, cardedPlayers.team1, 'team1')}
          {renderTeamSection(team2, cardedPlayers.team2, 'team2')}
        </div>
      )}
      {/* Removed main Save & Close / Cancel buttons from the bottom */}
    </div>
  );
};

export default TabCards;
