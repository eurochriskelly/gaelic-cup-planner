import ScoreDisplay from './../../../generic/ScoreDisplay'
import ClockIcon from './../../../generic/ClockIcon'
import styles from './Fixture.module.css'

const Fixture = ({ fixture, isFocus }) => {
    const {
        id, Scheduled,
        Started,
        Category,
        Team1, Goals1, Points1,
        Team2, Goals2, Points2,
    } = fixture

    const tlen = 24

    const totalTeam1 = (Goals1 || 0) * 3 + (Points1 || 0)
    const totalTeam2 = (Goals2 || 0) * 3 + (Points2 || 0)
    const winner = totalTeam1 > totalTeam2
        ? Team1
        : totalTeam1 < totalTeam2 ? Team2 : ''

    const scoreUpToDate = (Goals1 || Goals1 === 0) && (Goals2 || Goals2 === 0) && (Points1 || Points1 === 0) && (Points2 || Points2 === 0)
    const rowClasses = () => {
        const classes = []
        if (scoreUpToDate) {
            classes.push(styles.scoreUpToDate)
        }
        return classes.join(' ')
    }

    return <div className={`${styles.fixture} ${isFocus ? styles.focusFixture : ''}`} key={id}>
        <div className={rowClasses()} style={{ backgroundColor: scoreUpToDate ? '#bcc6bc' : '' }}>
            <div>
                <ClockIcon started={Started} scheduled={Scheduled} focus={isFocus} played={scoreUpToDate} />
                <span>
                    <span>Group Stage</span>
                    <span>{Category.replace(/[0-9]/g, '')}</span>
                </span>
            </div>
            <div>
                <div className={(winner === Team1 ? styles.winner : '') + ' teamName'}>{
                    Team1.length > tlen
                        ? Team1.substring(0, tlen) + '...'
                        : Team1
                }</div>
                <ScoreDisplay goals={Goals1} points={Points1} />
            </div>
            <div>
                <div className={(winner === Team2 ? styles.winner : '') + ' teamName'}>{
                    Team2.length > tlen
                        ? Team2.substring(0, tlen) + '...'
                        : Team2
                }</div>
                <ScoreDisplay goals={Goals2} points={Points2} />
            </div>
        </div>
    </div>
}

export default Fixture;