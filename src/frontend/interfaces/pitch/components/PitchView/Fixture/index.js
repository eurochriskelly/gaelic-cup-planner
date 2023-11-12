import ScoreDisplay from './../../../generic/ScoreDisplay'
import ClockIcon from './../../../generic/ClockIcon'
import styles from './Fixture.module.scss'

const Fixture = ({ fixture, isFocus }) => {
    const {
        id, tournamentId,
        scheduled = '', started = '',
        startedTime = '',  scheduledTime ='',
        category, stage,
        team1, goals1, points1,
        team2, goals2, points2,
        played,
        umpireTeam
    } = fixture

    const tlen = 24

    const totalTeam1 = (goals1 || 0) * 3 + (points1 || 0)
    const totalTeam2 = (goals2 || 0) * 3 + (points2 || 0)
    const winner = totalTeam1 > totalTeam2
        ? team1
        : totalTeam1 < totalTeam2 ? team2 : ''

    const scoreUpToDate = !!played
    const rowClasses = () => {
        const classes = []
        if (scoreUpToDate) {
            classes.push('scoreUpToDate')
        }
        return classes.join(' ')
    }

    return <div className={`${styles.fixture} ${isFocus ? styles.focusFixture : ''}`} key={id}>
        <div className={rowClasses()} style={{ backgroundColor: scoreUpToDate ? '#bcc6bc' : '' }}>
            <div>
                <ClockIcon started={started} scheduled={scheduledTime} focus={isFocus} played={scoreUpToDate} />
                <span>
                    <span>Group Stage</span>
                    <span>{category.replace(/[0-9]/g, '')}</span>
                </span>
            </div>
            <div>
                <div className={(winner === team1 ? styles.winner : '') + ' teamName'}>{
                    team1.length > tlen
                        ? team1.substring(0, tlen) + '...'
                        : team1
                }</div>
                <ScoreDisplay goals={goals1} points={points1} />
            </div>
            <div>
                <div className={(winner === team2 ? styles.winner : '') + ' teamName'}>{
                    team2.length > tlen
                        ? team2.substring(0, tlen) + '...'
                        : team2
                }</div>
                <ScoreDisplay goals={goals2} points={points2} />
            </div>
        </div>
    </div>
}

export default Fixture;