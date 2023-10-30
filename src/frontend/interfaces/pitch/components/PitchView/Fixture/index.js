import ScoreDisplay from './../../ScoreDisplay'
import styles from './Fixture.module.css'

const Fixture = ({ header, fixture, key }) => {
    const {
        id, Scheduled,
        Category,
        Team1, Goals1, Points1,
        Team2, Goals2, Points2,
    } = fixture;
    const s = n => ({ width: `${n}px` })
    const tlen = 14

    const scoreUpToDate = (Goals1 || Goals1 === 0) && (Goals2 || Goals2 === 0) && (Points1 || Points1 === 0) && (Points2 || Points2 === 0)
    const rowClasses = () => {
        const classes = []
        if (scoreUpToDate) {
            classes.push(styles.scoreUpToDate)
        }
        if (header) {
            classes.push(styles.header)
        }
        classes.push(`II__${Category}`)
        classes.push(`II__${scoreUpToDate}`)
        return classes.join(' ')
    }

    return <div className={styles.fixture} key={id}>
        <div className={rowClasses()}>
            <div style={s(5)}> </div>
            <div style={s(45)} className={styles.group}>
                <span>{Category.replace(/[0-9]/g, '')}</span>
            </div>
            <div style={s(80)}>{Scheduled}</div>
            <div style={s(400)} className='teamName'>{
                Team1.length > tlen ? Team1.substring(0, tlen) + '...' : Team1
            }</div>
            <div style={s(100)}>
                <ScoreDisplay header={header} goal={Goals1} points={Points1} />
            </div>
            <div style={s(400)} className='teamName'>{
                Team2.length > tlen ? Team2.substring(0, tlen) + '...' : Team2
            }</div>
            <div style={s(100)}>
                <ScoreDisplay header={header} goal={Goals2} points={Points2} />
            </div>
        </div>
    </div>
}

export default Fixture;