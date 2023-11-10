import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Fixture from "./Fixture"
import UpdateFixture from "./UpdateFixture"
import './PitchView.css'

const PitchView = () => {
    const { pitchId } = useParams()
    const navigate = useNavigate()
    const backToSelection = () => navigate('/')

    const [fixtures, setFixtures] = useState([])
    const [nextFixture, setNextFixture] = useState(null)

    const actions = {
        fetchFixtures: async () => {
            fetch(`/api/fixtures/${pitchId}`)
                .then(response => response.json())
                .then(data => {
                    console.log('fixtures', data)
                    setFixtures(data.data)
                    setNextFixture(data.data
                        .filter(f => !f.played)
                        .shift())
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
        },
        delayByOne: async (fixtureId) => {
            console.log('delayByOne')
        },
        delayUntilEnd: async (fixtureId) => {
            console.log('delayUntilEnd')
        },
    }

    useEffect(() => {
        actions.fetchFixtures()
    }, [])


    return <div className='pitchView'>
        <div className='fixturesHead'>
            <h2>
                <span onClick={backToSelection}></span>
                <span>Fixtures for pitch: {pitchId}</span>
            </h2>
        </div>
        <div className='fixturesArea'>{
            fixtures.map(fixture => {
                const focusFixture = nextFixture && nextFixture.id === fixture.id
                const focusStyle = {
                    border: '10px solid #4c226a',
                    borderRadius: '1.5rem',
                    marginBottom: '8px',
                    backgroundColor: '#c6b3d3',
                }
                return <div key={fixture.id}
                    className={focusFixture ? 'focusFixture' : ''}
                    style={focusFixture ? focusStyle : {}}>
                    <Fixture fixture={fixture} isFocus={focusFixture} />
                    {
                        nextFixture && nextFixture.id === fixture.id &&
                        <UpdateFixture
                            fixture={fixture}
                            updateFixtures={actions.fetchFixtures}
                            delayByOne={actions.delayByOne}
                            delayUntilEnd={actions.delayUntilEnd}
                        />
                    }
                </div>
            })
        }</div>
    </div >
}

export default PitchView