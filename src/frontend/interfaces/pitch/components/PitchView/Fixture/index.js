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
    const tlen = 14

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
        <div className={rowClasses()} style={{backgroundColor: scoreUpToDate ? '#b3c6b3' : ''}}>
            <div style={s(5)}> </div>
            <div style={s(45)} className={styles.group}>
                <span>{Category.replace(/[0-9]/g, '')}</span>
            </div>
            <div style={s(80)}>{Scheduled}</div>
            <div style={s(400)} className={(winner === Team1 ? styles.winner : '') + ' teamName'}>{
                Team1.length > tlen
                    ? Team1.substring(0, tlen) + '...'
                    : Team1
            }</div>
            <div style={s(100)}>
                <ScoreDisplay header={header} goals={Goals1} points={Points1} />
            </div>
            <div style={s(400)} className={(winner === Team2 ? styles.winner : '') + 'teamName'}>{
                Team2.length > tlen
                    ? Team2.substring(0, tlen) + '...'
                    : Team2
            }</div>
            <div style={s(100)}>
                <ScoreDisplay header={header} goals={Goals2} points={Points2} />
            </div>
        </div>
    </div>
}

export default Fixture;