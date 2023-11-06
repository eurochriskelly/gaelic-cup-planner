import ScoreDisplay from './../../../generic/ScoreDisplay'
import styles from './Fixture.module.css'

const Fixture = ({ fixture, isFocus }) => {
    const {
        id, Scheduled,
        Category,
        Team1, Goals1, Points1,
        Team2, Goals2, Points2,
    } = fixture;

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
                <span>
                    <svg width="10" height="10" viewBox="0 0 30 30">
                        <circle cx="12" cy="12" r="7" stroke="#869f84" strokeWidth={2} fill="#88b288"></circle>
                        <path d="M 12,12 L 12,6" stroke="white"></path>
                        <path d="M 12,12 L 16,16" stroke="white"></path>
                    </svg>
                    <span>{Scheduled}</span>
                </span>
                <span>
                    <span>GROUP:</span>
                    <span>{Category.replace(/[0-9]/g, '')}</span>
                </span>
                <span>
                    <span>STAGE:</span>
                    <span>Group</span>
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