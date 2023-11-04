import React, { useState } from 'react'
import ScorePicker from './ScorePicker'
import styles from './DrawerFinish.module.scss'

const DrawerFinish = ({
    fixture,
    onClose = () => { },
    onConfirm = () => { }
}) => {
    const steps = ['score', 'cardedPlayers']
    // create a state object to store the current step and the current task
    const [currentTeam, setCurrentTeam] = useState('')
    const [currentType, setCurrentType] = useState('')
    const [state, setState] = useState({
        step: 0,
    })
    const [scores, setScores] = useState({
        Team1: {
            goals: '',
            points: '',
        },
        Team2: {
            goals: '',
            points: '',
        },
    })
    const [scorePicker, setScorePicker] = useState({ visible: false })

    const rules = {
        score: {
            display: state.step === 0 ? 'block' : 'none'
        },
        fillCards: {
            display: state.step === 1 ? 'block' : 'none'
        },
    }

    const actions = {
        yesCardedPlayers: () => {
            setState({ step: 2 })
        },
        noCardedPlayers: () => {
            setState({ step: 2 })
        },
        saveScore: async () => {
            await onConfirm()
            // move step on
            setState({ step: 1 })
        },
        notReadyToSaveScore: () => {
            onClose()
            setState({ step: 1 })
        },
        cardPlayersUpdated: () => {
            onClose()
            setState({ step: 0 })
        },
        updateScore: (team, type, amount) => {
            setCurrentTeam(team)
            setCurrentType(type)
            setScorePicker({ visible: true })
        }
    }

    const showSquares = () => {
        const squares = [];
        for (let i = 0; i <= 23; i++) {
            squares.push(
                <div key={i} className={styles.square} onClick={() => {
                    const newScore = {
                        ...scores,
                        [currentTeam]: {
                            ...scores[currentTeam],
                            [currentType]: i
                        }
                    }
                    console.log('newScore', newScore)
                    setScores(newScore)
                    setScorePicker({ visible: false })
                }}>
                    {(i && (i % 23 === 0)) ? '...' : i}
                </div>
            );
        }
        return <div>{squares}</div>
    }

    const { Team1, Team2 } = fixture
    const displayScore = (team, type) => {
        const score = scores[team][type]
        return score || score === 0 ? score : '?'
    }
    return <div className={styles.drawerFinish}>

        <div className={styles.drawerStep} style={rules.score}>
            <div className="drawer-header">Update match score</div>
            <div className="drawer-container" style={{ position: 'relative' }}>
                <div>
                    <div className={styles.teamScore}>
                        <h4>{Team1}</h4>
                        <div>
                            <div onClick={actions.updateScore.bind(null, 'Team1', 'goals')}>{displayScore('Team1', 'goals')}</div>
                            <div onClick={actions.updateScore.bind(null, 'Team1', 'points')}>{displayScore('Team1', 'points')}</div>
                        </div>
                    </div>
                    <div className={styles.teamScore}>
                        <h4>{Team2}</h4>
                        <div>
                            <div onClick={actions.updateScore.bind(null, 'Team2', 'goals')}>{displayScore('Team2', 'goals')}</div>
                            <div onClick={actions.updateScore.bind(null, 'Team2', 'points')}>{displayScore('Team2', 'points')}</div>
                        </div>
                    </div>
                    <div className={styles.proceedButtons}>
                        <button className="enabled" onClick={actions.saveScore}>Proceed</button>
                        <button onClick={actions.notReadyToSaveScore}>Cancel</button>
                    </div>
                </div>
                <div className={styles.scoreSelect} style={{ display: scorePicker.visible ? 'block' : 'none' }}>
                    {showSquares()}
                </div>
            </div>
        </div>


        <div className={styles.drawerStep} style={rules.fillCards}>
            <div className="drawer-header">List carded players</div>
            <div className="drawer-container">
                <div> TODO: allow entry of carded players here </div>
                <div>
                    <button onClick={actions.cardPlayersUpdated} className="enabled">Done</button>
                </div>
            </div>
        </div>
    </div>
}

export default DrawerFinish