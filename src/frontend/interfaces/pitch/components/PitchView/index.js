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

    return <div className={styles.container}>
        <h2>
            <span onClick={backToSelection}></span>
            <span>Fixtures for pitch: {pitchId}</span>
        </h2>
        <Fixture
            header={true}
            fixture={{
                Scheduled: 'Time',
                Category: 'G',
                Team1: 'Team 1',
                Goals1: '',
                Points1: '',
                Team2: 'Team 2',
                Goals2: '',
                Points2: '',
            }} />
        {
            fixtures.map(fixture => {
                const focusFixture = nextFixture && nextFixture.id === fixture.id
                const focusStyle = {
                    border: '4px solid #4c226a'
                }
                return <div key={fixture.id} className={focusFixture ? 'focusFixture' : ''} style={focusFixture ? focusStyle : {}}>
                    <Fixture fixture={fixture} />
                    {
                        nextFixture && nextFixture.id === fixture.id &&
                        <UpdateFixture />
                    }
                </div>
            })
        }
    </div >
}

export default PitchView