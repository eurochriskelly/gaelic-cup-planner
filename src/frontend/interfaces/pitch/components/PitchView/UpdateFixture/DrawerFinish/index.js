import React, { useState } from 'react'
import './DrawerFinish.css'

const DrawerFinish = ({
    fixture,
    updateFixtures,
    visible,
    onConfirm = () => { }
}) => {
    if (!visible) return null
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
            google.script.run
                .withSuccessHandler(fixtures => setState({ step: 1 }))
                .updateMatchScore(fixture.id, scores)
        },
        notReadyToSaveScore: () => {
            setState({ step: 1 })
        },
        cardPlayersUpdated: () => {
            setState({ step: 0 })
            updateFixtures()
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
                <div key={i} className='square' onClick={() => {
                    const newScore = {
                        ...scores,
                        [currentTeam]: {
                            ...scores[currentTeam],
                            [currentType]: i
                        }
                    }
                    setScores(newScore)
                    setScorePicker({ visible: false })
                }}>
                    {(i && (i % 23 === 0)) ? '...' : i}
                </div>
            );
        }
        return <div>{squares}</div>
    }

    const scoresNotReady = () => {
        return !(scores.Team1.goals !== '' &&
            scores.Team1.points !== '' &&
            scores.Team2.goals !== '' &&
            scores.Team2.points !== '')
    }

    const { Team1, Team2 } = fixture
    const displayScore = (team, type) => {
        const score = scores[team][type]
        return score || score === 0 ? score : '?'
    }
    return <div className='drawerFinish'>
        <div className='drawerStep' style={rules.score}>
            <div className="drawer-header">Update match score</div>
            <div className="drawer-container" style={{ position: 'relative' }}>
                <div>
                    <div className='teamScore'>
                        <h4>{Team1}</h4>
                        <div>
                            <div onClick={actions.updateScore.bind(null, 'Team1', 'goals')}>{displayScore('Team1', 'goals')}</div>
                            <div onClick={actions.updateScore.bind(null, 'Team1', 'points')}>{displayScore('Team1', 'points')}</div>
                        </div>
                    </div>
                    <div className='teamScore'>
                        <h4>{Team2}</h4>
                        <div>
                            <div onClick={actions.updateScore.bind(null, 'Team2', 'goals')}>{displayScore('Team2', 'goals')}</div>
                            <div onClick={actions.updateScore.bind(null, 'Team2', 'points')}>{displayScore('Team2', 'points')}</div>
                        </div>
                    </div>
                    <div className='proceedButtons' >
                        <button disabled={scoresNotReady()} className={ scoresNotReady() ? 'disabled' : 'enabled'} onClick={actions.saveScore}>Proceed</button>
                        <button onClick={actions.notReadyToSaveScore}>Cancel</button>
                    </div>
                </div>
                <div className='scoreSelect' style={{ display: scorePicker.visible ? 'block' : 'none' }}>
                    {showSquares()}
                </div>
            </div>
        </div>


        <div className='drawerStep' style={rules.fillCards}>
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