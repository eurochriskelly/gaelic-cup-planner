import { useParams, useNavigate } from "react-router-dom"
import Fixture from "./Fixture"
import UpdateFixture from "./UpdateFixture"
import styles from './PitchView.module.css'

const PitchView = () => {
    const { pitchId } = useParams()
    const navigate = useNavigate()
    const backToSelection = () => navigate('/')
    let fixtures = []
    let nextFixture = null

    google.script.run
        .withSuccessHandler(data => {
            console.log('fixtures', data)
            fixtures = data
            nextFixture = fixtures
                .filter(f => {
                    return f.Goals1 === '' && f.Goals2 === ''
                })
                .shift()
        })
        .getFixtures(pitchId)
    return <div className={styles.pitchView}>
        <div className={styles.fixturesHead}>
            <h2>
                <span onClick={backToSelection}></span>
                <span>Fixtures for pitch: {pitchId}</span>
            </h2>
            <Fixture
                header={true}
                fixture={{
                    Scheduled: 'Time',
                    Category: 'G_',
                    Team1: 'Team 1',
                    Goals1: '',
                    Points1: '',
                    Team2: 'Team 2',
                    Goals2: '',
                    Points2: '',
                }} />
        </div>
        <div className={styles.fixturesArea}>{
            fixtures.map(fixture => {
                const focusFixture = nextFixture && nextFixture.id === fixture.id
                const focusStyle = {
                    border: '10px solid #4c226a',
                    borderRadius: '18px',
                    marginBottom: '8px',
                    backgroundColor: '#c6b3d3',
                }
                return <div key={fixture.id} className={focusFixture ? 'focusFixture' : ''} style={focusFixture ? focusStyle : {}}>
                    <Fixture fixture={fixture} />
                    {
                        nextFixture && nextFixture.id === fixture.id &&
                        <UpdateFixture fixture={fixture} />
                    }
                </div>
            })
        }</div>
    </div >
}

export default PitchView