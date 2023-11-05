const ScoreDisplay = ({ header, goals, points }) => {
    if (header) return <span>Score</span>
    let haveGoals = true
    let havePoints = true
    if (goals === '' || goals === null || goals === undefined) {
        haveGoals = false    
    }

    if (points === '' || points === null || points === undefined) {
        havePoints = false    
    }
    const style = {
        backgroundColor: '#eee',
        border: '1px solid #bbb',
        borderRadius: '4px',
        padding: '1rem 0.2rem',
        fontSize: '1.0em',
        minWidth: '100px',
    }
    if (!havePoints && !haveGoals) {
        return <span style={style}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    }
    return <span style={{
        fontSize: '1.0em',
        textAlign: 'center',
        padding: '9px 0',
        backgroundColor: 'rgba(179,198,179,0.5)',
    }}>{goals||'0'}-{points||'0'} <span style={{ color: '#888'}}>(<span style={{fontWeight: 'bold', color: '#000'}}>{
        (goals||0)*3 + (points||0)
    }</span>)</span></span>
}

export default ScoreDisplay