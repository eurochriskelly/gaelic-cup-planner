import React, { useState } from 'react'
import styles from './ListCardedPlayers.module.scss'

const CardedPlayerRow = ({ id, data, onAdd, onRemove }) => {
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerName, setPlayerName] = useState('');

  const buttonStyle = () => {
    return playerNumber && playerName ? 'enabled' : 'disabled'
  }
  const filled = playerName && playerNumber
  return (
    <div key={`cardedplayer-${id}`}>
      <input
        type="number"
        placeholder="Player Number"
        value={playerNumber}
        onChange={(e) => setPlayerNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Player Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button disabled={!filled} className={buttonStyle()} onClick={() => {
        if (data) {
          onRemove(data)
        } else {
          onAdd({ id, playerNumber, playerName })
        }
      }}>{data ? '-' : '+'}</button>
    </div>
  )
}

const ListCardedPlayers = () => {
  const [allowClose, setAllowClose] = useState(false)
  const [cardedPlayers, setCardedPlayers] = useState([])
  const actions = {
    cardPlayersUpdated: () => {
      console.log('cardPlayersUpdated')
    },
    onAdd: (details) => {
      setCardedPlayers([...cardedPlayers, details])
    },
    onRemove: (details) => {
      const newCardedPlayers = cardedPlayers.filter((player) => {
        return player.id !== details.id
      })
      setCardedPlayers(newCardedPlayers)
    }
  }

  return (
    <div style={styles.cardedPlayerRow}>
      <h2>Carded players?</h2>
      <div>
      {
        [...cardedPlayers, ''].map((player, index) => {
          const data = index < cardedPlayers.length ? cardedPlayers[index] : null
          return (
            <CardedPlayerRow id={index} data={data} onAdd={actions.onAdd} onRemove={actions.onRemove} />
          )
        })  
      }
      </div>
      <div>
        <button onClick={actions.cardPlayersUpdated} className={allowClose ? 'enabled' : 'disabled'}>
          Done
        </button>
      </div>
    </div>
  )
};

export default ListCardedPlayers;