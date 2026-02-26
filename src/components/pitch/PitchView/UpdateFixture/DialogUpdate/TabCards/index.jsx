import { useState } from "react";
import CardButton from "./CardButton";
import './TabCards.scss';

const TabCards = ({
  team1,
  team2,
  cardedPlayers,
  setCardedPlayer, // This will update the state in CardEntryWrapper
  fixture, // fixture might still be needed for context, e.g. tournamentId, fixture.id if API was here
  onEditStart
  // onSaveComplete and onCancel props removed
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    team: team1,
    cardColor: '',
    playerNumber: '',
    playerName: ''
  });
  const [useCustomNumber, setUseCustomNumber] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  // handleSaveCards function (previously handleSaveCardsAndClose) is removed as API call moves to parent.

  const actions = {
    addOrUpdateCard: () => {
      const playerNumber = parseInt(formData.playerNumber, 10);
      if (!playerNumber) {
        alert('Player number is required.');
        return;
      }
      if (!formData.playerName.trim()) {
        alert('Player name is required.');
        return;
      }
      // no id means new card 
      const card = {
        id: editingCard ? editingCard.id : null, 
        team: formData.team,
        cardColor: formData.cardColor,
        playerNumber,
        playerName: formData.playerName.trim(),
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
      const isCustomNumber = Number(card.playerNumber) < 1 || Number(card.playerNumber) > 20;
      setFormData({
        team: card.team,
        cardColor: card.cardColor,
        playerNumber: card.playerNumber,
        playerName: card.playerName === 'Not provided' ? '' : card.playerName
      });
      setUseCustomNumber(isCustomNumber);
      setShowForm(true);
      setEditingStep(null);
    },
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCard(null);
    setUseCustomNumber(false);
    setEditingStep(null);
    setFormData({ team: team1, cardColor: '', playerNumber: '', playerName: '' });
  };

  const selectedNumber = parseInt(formData.playerNumber, 10);
  const hasCardType = !!formData.cardColor;
  const hasNumber = !!selectedNumber;
  const canSave = hasCardType && hasNumber && !!formData.playerName.trim();
  const numberChoices = Array.from({ length: 20 }, (_, idx) => idx + 1);
  const cardLabel = formData.cardColor ? formData.cardColor.charAt(0).toUpperCase() : '-';
  const showCardStep = !hasCardType || editingStep === 'card';
  const showNumberStep = hasCardType && (!hasNumber || editingStep === 'number') && !showCardStep;
  const showNameStep = hasNumber && !showCardStep && !showNumberStep;

  const renderCardForm = () => (
    <div className="card-form-overlay">
      <div className="card-form card-wizard AscendantPanel">
        <h3>{editingCard ? 'Edit Card' : 'Add Card'}</h3>

        <div className="wizard-summary-row">
          <div className="summary-item team">
            <span className="label">Team</span>
            <span className="value">{formData.team}</span>
          </div>
          {hasCardType && (
            <button
              type="button"
              className={`summary-item editable card card-${formData.cardColor}`}
              onClick={() => setEditingStep('card')}
            >
              <span className="label">Card</span>
              <span className="value">{cardLabel}</span>
              <span className="edit-hint">Edit</span>
            </button>
          )}
          {hasNumber && (
            <button
              type="button"
              className="summary-item editable number"
              onClick={() => setEditingStep('number')}
            >
              <span className="label">Shirt #</span>
              <span className="value">{selectedNumber}</span>
              <span className="edit-hint">Edit</span>
            </button>
          )}
        </div>

        {showCardStep && (
          <div className="wizard-step">
            <label>1. Select Card</label>
            <div className="card-type-selection">
              <CardButton
                type="R"
                onClick={() => {
                  setFormData({ ...formData, cardColor: 'red' });
                  setEditingStep(null);
                }}
                active={formData.cardColor === 'red'}
              />
              <CardButton
                type="Y"
                onClick={() => {
                  setFormData({ ...formData, cardColor: 'yellow' });
                  setEditingStep(null);
                }}
                active={formData.cardColor === 'yellow'}
              />
              <CardButton
                type="B"
                onClick={() => {
                  setFormData({ ...formData, cardColor: 'black' });
                  setEditingStep(null);
                }}
                active={formData.cardColor === 'black'}
              />
            </div>
          </div>
        )}

        {showNumberStep && (
          <div className="wizard-step">
            <label>2. Pick Shirt Number</label>
            <div className="number-grid">
              {numberChoices.map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`number-button ${selectedNumber === num ? 'active' : ''}`}
                  onClick={() => {
                    setUseCustomNumber(false);
                    setFormData({ ...formData, playerNumber: num });
                    setEditingStep(null);
                  }}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                className={`number-button custom ${useCustomNumber ? 'active' : ''}`}
                onClick={() => {
                  setUseCustomNumber(true);
                  setFormData({ ...formData, playerNumber: '' });
                  setEditingStep(null);
                }}
              >
                Other
              </button>
            </div>
            {useCustomNumber && (
              <input
                type="number"
                min="1"
                value={formData.playerNumber}
                onChange={(e) => setFormData({ ...formData, playerNumber: e.target.value })}
                placeholder="Enter number"
                className="custom-number-input"
              />
            )}
          </div>
        )}

        {showNameStep && (
          <div className="wizard-step">
          <label>3. Player Name</label>
          <input
            type="text"
            value={formData.playerName}
            style={{ textTransform: 'uppercase' }}
            onChange={(e) => setFormData({ ...formData, playerName: e.target.value.toUpperCase() })}
            placeholder="Enter player name"
          />
        </div>
        )}

        <div className="form-actions">
          <button className="cancel-button" onClick={resetForm}>
            <i className="pi pi-times"></i> Cancel
          </button>
          <button className="save-button" onClick={actions.addOrUpdateCard} disabled={!canSave}>
            <i className="pi pi-check"></i> {editingCard ? 'Save Card' : 'Add Card'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderTeamSection = (team, cards, suffix) => (
    <div className={`team-section team-${suffix}`}>
         <div className="team-header">
           <h4>
             <span className="team-label">Team</span>
             <span className="team-name">{team}</span>
           </h4>
           {!showForm && (
             <button
               className="add-card-button"
               onClick={() => {
                 if (onEditStart && !onEditStart()) return;
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
                   onClick={() => {
                     if (onEditStart && !onEditStart()) return;
                     actions.editCard(card);
                   }}
                   title="Edit Card"
                 ></i>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-cards">No cards recorded yet</p>
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
        </div>
      )}
      {/* Removed main Save & Close / Cancel buttons from the bottom */}
    </div>
  );
};

export default TabCards;
