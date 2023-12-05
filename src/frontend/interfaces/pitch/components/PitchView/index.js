import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../../../../shared/api/pitch"
import Fixture from "./Fixture"
import UpdateFixture from "./UpdateFixture"
import styles from './PitchView.module.scss'

const PitchView = () => {
    const { pitchId } = useParams()
    const navigate = useNavigate()
    const backToSelection = () => navigate('/')

    const [fixtures, setFixtures] = useState([])
    const [nextFixture, setNextFixture] = useState(null)
    const [fixtureVisibility, setFixtureVisibility] = useState([])
    const [showEarlier, setShowEarlier] = useState(false)
    const [showLater, setShowLater] = useState(false)

    const actions = {
        fetchFixtures: async () => {
            const { data } = await API.fetchFixtures(pitchId)
            setFixtures(data)
            setNextFixture(data
                .filter(f => !f.played)
                .shift())

            const notPlayed = data.findIndex(f => !f.played)
            const preNotPlayed = notPlayed - 1 >= 0 ? notPlayed - 1 : 0
            const postNotPlayed = notPlayed + 1 < data.length ? notPlayed + 1 : notPlayed
            const visibility = data.map((f, i) => {
                if (i === notPlayed) {
                    return 'visible'
                }
                if (i === preNotPlayed) {
                    return 'visible'
                }
                if (i === postNotPlayed) {
                    return 'visible'
                }
                if (i < preNotPlayed) {
                    return 'earlier'
                }
                if (i > preNotPlayed) {
                    return 'later'
                }
                return 'hidden'
            })
            setFixtureVisibility(visibility)
        },
        delayByOne: async (fixtureId) => {
            console.log('delayByOne')
        },
        delayUntilEnd: async (fixtureId) => {
            console.log('delayUntilEnd')
        },
        startMatch: async (fixtureId) => {
            await API.startMatch(fixtureId)
            const data = await API.fetchFixtures(pitchId)
            setFixtures(data.data)
        },
        showEarlier: () => setShowEarlier(!showEarlier),
        showLater: () => setShowLater(!showLater),
    }

    useEffect(() => {
        actions.fetchFixtures()
    }, [])


    return <div className={styles.pitchView}>
        <div className={styles.fixturesHead}>
            <h2>
                <span onClick={backToSelection}></span>
                <span>Fixtures for pitch: {pitchId}</span>
            </h2>
        </div>
        <div className={styles.fixturesBody}>
            <button onClick={actions.showEarlier}>{showEarlier ? 'Hide' : 'Show'} Earlier Fixtures</button>
            <div className={styles.fixturesArea}>{
                fixtures.map((fixture, i) => {
                    const focusFixture = nextFixture && nextFixture.id === fixture.id
                    const style = {
                        display: ((fixtureVisibility[i] === 'earlier') && !showEarlier)
                            ? 'none'
                            : ((fixtureVisibility[i] === 'later') && !showLater)
                                ? 'none'
                                : 'block'
                    }
                    const focusStyle = {
                        ...style,
                        border: '10px solid #4c226a',
                        borderRadius: '1.5rem',
                        marginBottom: '8px',
                        backgroundColor: '#c6b3d3',
                    }
                    return <div key={fixture.id}
                        className={focusFixture ? 'focusFixture' : ''}
                        style={focusFixture ? focusStyle : style}>
                        <Fixture fixture={fixture} isFocus={focusFixture} />
                        {
                            nextFixture && nextFixture.id === fixture.id &&
                            <UpdateFixture
                                fixture={fixture}
                                updateFixtures={actions.fetchFixtures}
                                startMatch={actions.startMatch}
                                delayByOne={actions.delayByOne}
                                delayUntilEnd={actions.delayUntilEnd}
                            />
                        }
                    </div>
                })
            }</div>
            <button onClick={actions.showLater}>{showLater ? 'Hide' : 'Show'} Later Fixtures</button>
        </div>
    </div >
}

export default PitchView