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
        padding: '5px',
        fontSize: '0.8em',
        minWidth: '100px',
    }
    if (!havePoints && !haveGoals) {
        return <span style={style}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    }
    return <span>{goals||'0'}-{points||'0'} ({
        (goals||0)*3 + (points||0)
    })</span>
}

export default ScoreDisplay