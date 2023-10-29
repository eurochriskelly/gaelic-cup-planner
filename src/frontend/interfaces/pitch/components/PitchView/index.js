import { useParams, useNavigate } from "react-router-dom"
import Fixture from "./Fixture"
import styles from './PitchView.module.css'

const PitchView = () => {
    const { pitchId } = useParams()
    const navigate = useNavigate()
    const backToSelection = () => navigate('/')
    let fixtures = []
    google.script.run
        .withSuccessHandler(data => fixtures = data)
        .getFixtures(pitchId)

    return <div className={styles.container}>
        <h2>
            <span onClick={backToSelection}></span>
            <span>Fixtures for pitch: {pitchId}</span>
        </h2>
        <Fixture header={true} fixture={{
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
                <Fixture fixture={fixture} />
            })
        }
    </div >
}

export default PitchView