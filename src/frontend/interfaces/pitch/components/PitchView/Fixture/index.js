import ScoreDisplay from './../../ScoreDisplay'
import styles from './Fixture.module.css'

const Fixture = ({ header, fixture, key }) => {
    const { 
        id, Scheduled, 
        Category,
        Team1, Goals1, Points1,
        Team2, Goals2, Points2,
    } = fixture;
    const s = n => ({width: `${n}px`})
    const tlen=14
    return (
        <div className={styles.container} key={id}>
            <div style={s(80)}>{Scheduled}</div>
            <div style={s(45)}>{Category.replace(/[0-9]/g, '')}</div>
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
    );

}

export default Fixture;