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
    if (!havePoints && !haveGoals) {
        return <span></span>
    }
    return <span>{goals||'0'}-{points||'0'} ({
        (goals||0)*3 + (points||0)
    })</span>
}

export default ScoreDisplay