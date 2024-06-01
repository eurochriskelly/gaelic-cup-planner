import React, { useState } from "react";
import CardSelector from "./CardSelector";

const CardedPlayerRow = ({ id, team, data, onAdd, onRemove }) => {
  const [playerNumber, setPlayerNumber] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerCard, setPlayerCard] = useState("");

  const buttonStyle = () => {
    return playerNumber && playerName ? "enabled" : "disabled";
  };
  const filled = playerName && playerNumber && playerCard;
  return (
    <div className='CardedPlayerRow' key={`cardedplayer-${id}`}>
      <CardSelector onCard={(card) => { setPlayerCard(card) }} />
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
            team,
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
  team1,
  team2,
  onProceed = () => {}
}) => {
  const [allowClose, setAllowClose] = useState(false);
  const [cardedPlayersTeam1, setCardedPlayersTeam1] = useState([]);
  const [cardedPlayersTeam2, setCardedPlayersTeam2] = useState([]);
  const actions = {
    onAddTeam1: (details) => {
      setCardedPlayersTeam1([...cardedPlayersTeam1, details])
    },
    onAddTeam2: (details) => {
      setCardedPlayersTeam2([...cardedPlayersTeam2, details])
    },
    onRemoveTeam1: (details) => {
      const newCardedPlayers = cardedPlayersTeam1.filter((player) => {
        return player.id !== details.id;
      });
      setCardedPlayersTeam1(newCardedPlayers);
    },
    onRemoveTeam2: (details) => {
      const newCardedPlayers = cardedPlayersTeam2.filter((player) => {
        return player.id !== details.id;
      });
      setCardedPlayersTeam2(newCardedPlayers);
    },
  };
  return (
    <div className='ListCardedPlayers'>
      <h3>
        <span>{team1}</span>
        <span float="right">({cardedPlayersTeam1.length} added)</span>
      </h3>
      <div style={{ display: allowClose ? "none" : "block" }}>
        {[...cardedPlayersTeam1, ""].map((player, index) => {
          const data = index < cardedPlayersTeam1.length ? cardedPlayersTeam1[index] : null;
          return (
            <CardedPlayerRow
              key={`cpr-${index}`}
              id={index}
              team={team1}
              data={data}
              onAdd={actions.onAddTeam1}
              onRemove={actions.onRemoveTeam1}
            />
          );
        })}
      </div>
      <h3>
        <span>{team2}</span>
        <span float="right">({cardedPlayersTeam2.length} added)</span>
      </h3>
      <div style={{ display: allowClose ? "none" : "block" }}>
        {[...cardedPlayersTeam2, ""].map((player, index) => {
          const data = index < cardedPlayersTeam2.length ? cardedPlayersTeam2[index] : null;
          return (
            <CardedPlayerRow
              key={`cpr-${index}`}
              id={index}
              team={team2}
              data={data}
              onAdd={actions.onAddTeam2}
              onRemove={actions.onRemoveTeam2}
            />
          );
        })}
      </div>
      <div className='ready'>
        <input
          type="checkbox"
          id="allowClose"
          onChange={() => setAllowClose(!allowClose)} />
        <label>All carded players have been added?</label>
      </div>
      <button
        onClick={onProceed.bind(null, [...cardedPlayersTeam1, ...cardedPlayersTeam2])}
        className="enabled"
        style={{ display: allowClose ? "block" : "none", width: '100%' }}
      >Proceed to next game!</button>
    </div>
  );
};

export default ListCardedPlayers;

