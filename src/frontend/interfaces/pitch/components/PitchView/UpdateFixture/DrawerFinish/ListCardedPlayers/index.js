import React, { useState } from "react";
import CardSelector from "./CardSelector";

const CardedPlayerRow = ({ id, data, onAdd, onRemove }) => {
  const [playerNumber, setPlayerNumber] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerCard, setPlayerCard] = useState("");

  const buttonStyle = () => {
    return playerNumber && playerName ? "enabled" : "disabled";
  };
  const filled = playerName && playerNumber && playerCard;
  return (
    <div className='CardedPlayerRow' key={`cardedplayer-${id}`}>
      <CardSelector onCard={(card) => {
        setPlayerCard(card)     
      }} />
      <input
        type="number"
        placeholder="#"
        value={playerNumber}
        onChange={(e) => setPlayerNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Player Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button
        disabled={!filled}
        className={buttonStyle()}
        onClick={() => {
          const playerData= {
            id,
            playerCard,
            playerNumber,
            playerName: playerName.toUpperCase(),
          }
          if (data) {
            onRemove(data);
          } else {
            onAdd(playerData);
          }
        }}
      >{data ? "-" : "+"}</button>
    </div>
  );
};

const ListCardedPlayers = ({
  onProceed = () => {}
}) => {
  const [allowClose, setAllowClose] = useState(false);
  const [cardedPlayers, setCardedPlayers] = useState([]);
  const actions = {
    onAdd: (details) => {
      setCardedPlayers([...cardedPlayers, details])
    },
    onRemove: (details) => {
      const newCardedPlayers = cardedPlayers.filter((player) => {
        return player.id !== details.id;
      });
      setCardedPlayers(newCardedPlayers);
    },
  };
  return (
    <div className='ListCardedPlayersr'>
      <div style={{ display: allowClose ? "none" : "block" }}>
        {[...cardedPlayers, ""].map((player, index) => {
          const data = index < cardedPlayers.length ? cardedPlayers[index] : null;
          return (
            <CardedPlayerRow
              key={`cpr-${index}`}
              id={index}
              data={data}
              onAdd={actions.onAdd}
              onRemove={actions.onRemove}
            />
          );
        })}
      </div>
      <div className='ready'>
        <input
          type="checkbox"
          id="allowClose"
          onChange={() => setAllowClose(!allowClose)}
        />
        <label>Ready to proceed?</label>
      </div>
      <button
        onClick={onProceed.bind(null, cardedPlayers)}
        className="enabled"
        style={{ display: allowClose ? "block" : "none", width: '100%' }}
      >
        Proceed to next game!
      </button>
    </div>
  );
};

export default ListCardedPlayers;

