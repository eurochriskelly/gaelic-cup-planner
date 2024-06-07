import React, { useState } from "react";
import CardSelector from "./CardSelector";

const ListCardedPlayers = ({ team1, team2, onProceed = () => {} }) => {
  const [allowClose, setAllowClose] = useState(false);
  const [cardedPlayersTeam1, setCardedPlayersTeam1] = useState([]);
  const [cardedPlayersTeam2, setCardedPlayersTeam2] = useState([]);
  const actions = {
    onAddTeam1: (details) => {
      setCardedPlayersTeam1([...cardedPlayersTeam1, details]);
    },
    onAddTeam2: (details) => {
      setCardedPlayersTeam2([...cardedPlayersTeam2, details]);
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
    <div className="ListCardedPlayers">
      <div className="ready">
        <input
          type="checkbox"
          id="allowClose"
          onChange={() => setAllowClose(!allowClose)}
        />
        <label>All carded players have been added?</label>
      </div>
      <button
        onClick={onProceed.bind(null, [
          ...cardedPlayersTeam1,
          ...cardedPlayersTeam2,
        ])}
        className="enabled"
        style={{ display: allowClose ? "block" : "none", width: "100%" }}
      >
        Proceed to next game!
      </button>
      <CardedPlayersByTeam
        cardedPlayersTeam={cardedPlayersTeam1}
        team={team1}
        allowClose={allowClose}
        onAddTeam={actions.onAddTeam1}
        onRemoveTeam={actions.onRemoveTeam1}
      />
      <CardedPlayersByTeam
        cardedPlayersTeam={cardedPlayersTeam2}
        team={team2}
        allowClose={allowClose}
        onAddTeam={actions.onAddTeam2}
        onRemoveTeam={actions.onRemoveTeam2}
      />
    </div>
  );
};

export default ListCardedPlayers;

function CardedPlayersByTeam({
  cardedPlayersTeam,
  team,
  allowClose,
  onAddTeam,
  onRemoveTeam,
}) {
  return (
    <>
      <h3>
        <span>{team}</span>
        <span float="right">({cardedPlayersTeam.length} added)</span>
      </h3>
      <div style={{ display: allowClose ? "none" : "block" }}>
        {[...cardedPlayersTeam, ""].map((player, index) => {
          const data =
            index < cardedPlayersTeam.length ? cardedPlayersTeam[index] : null;
          return (
            <CardedPlayerRow
              key={`cpr-${index}`}
              id={index}
              team={team}
              data={data}
              onAdd={onAddTeam}
              onRemove={onRemoveTeam}
            />
          );
        })}
      </div>
    </>
  );
}

function CardedPlayerRow({ id, team, data, onAdd, onRemove }) {
  const [playerNumber, setPlayerNumber] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerCard, setPlayerCard] = useState("");
  const [showRow, setShowRow] = useState(false);

  const buttonStyle = () => {
    return playerNumber && playerName ? "enabled" : "disabled";
  };

  const handle = {
    showForm: () => setShowRow (true),
  }
  const filled = playerName && playerNumber && playerCard;
  return showRow ? (
    <div className="CardedPlayerRow" key={`cardedplayer-${id}`}>
      <CardSelector
        onCard={(card) => {
          setPlayerCard(card);
      }}
      />
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
          const playerData = {
            id,
            playerCard,
            playerNumber,
            playerName: playerName.toUpperCase(),
            team,
          };
          if (data) {
            onRemove(data);
          } else {
            onAdd(playerData);
          }
        }}
      >
        {data ? "-" : "+"}
      </button>
    </div>
  ) : (
    <button onClick={handle.showForm}>CARD {team} PLAYER</button>
  );
}
