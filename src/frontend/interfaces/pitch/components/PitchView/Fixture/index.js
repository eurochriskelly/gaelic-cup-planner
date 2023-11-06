import ScoreDisplay from './../../../generic/ScoreDisplay'
import styles from './Fixture.module.css'

const Fixture = ({ header, fixture }) => {
    const {
        id, Scheduled,
        Category,
        Team1, Goals1, Points1,
        Team2, Goals2, Points2,
    } = fixture;
    const s = n => ({ width: `${n}px` })
    const tlen = 28

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
        if (header) {
            classes.push(styles.header)
        }
        return classes.join(' ')
    }

    return <div className={styles.fixture} key={id}>
        <div className={rowClasses()} style={{ backgroundColor: scoreUpToDate ? '#b3c6b3' : '' }}>
            <div>
                <span>{ /*
                    <svg xmlns="http://www.w3.org/2000/svg" transform="scale(1)" viewBox="0 0 180 180">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="#84a084" stroke-width="1.5" />
                        <path d="M12 12l-3-3" stroke="#84a084" stroke-width="1" />
                        <line x1="12" y1="12" x2="17" y2="12" stroke="#84a084" stroke-width="2" />
                        <text x="12" y="5.5" font-family="Arial" text-anchor="middle" fill="#84a084" font-size="4">12</text>
                        <text x="18.5" y="13" font-family="Arial" text-anchor="middle" fill="#84a084" font-size="4">3</text>
                        <text x="12" y="20.5" font-family="Arial" text-anchor="middle" fill="#84a084" font-size="4">6</text>
                        <text x="5.5" y="13" font-family="Arial" text-anchor="middle" fill="#84a084" font-size="4">9</text>
                    </svg>
                    */}
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
                <div style={s(400)} className={(winner === Team1 ? styles.winner : '') + ' teamName'}>{
                    Team1.length > tlen
                        ? Team1.substring(0, tlen) + '...'
                        : Team1
                }</div>
                <ScoreDisplay header={header} goals={Goals1} points={Points1} />
            </div>
            <div>
                <div className={(winner === Team2 ? styles.winner : '') + 'teamName'}>{
                    Team2.length > tlen
                        ? Team2.substring(0, tlen) + '...'
                        : Team2
                }</div>
                <ScoreDisplay header={header} goals={Goals2} points={Points2} />
            </div>
        </div>
    </div>
}

export default Fixture;