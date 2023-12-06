export default class GroupManagerHelper {
    constructor() {
        this.groupLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.matches = {}
        this.teamList = []
        this.groupSizes = {}
        this.stageParameters = [
            {
                stage: 'group',
                groupSize: 3,
                duration: 15,
                break: 5,
                gap: 5,
            },
            {
                stage: 'group',
                groupSize: 4,
                duration: 10,
                break: 3,
                gap: 5,
            },
            {
                stage: 'group',
                groupSize: 5,
                duration: 7.5,
                break: 3,
                gap: 5,
            },
            {
                stage: 'eigth',
                groupSize: 16,
                duration: 7.5,
                break: 3,
                gap: 5,
            },
            {
                stage: 'quarter',
                groupSize: 8,
                duration: 7.5,
                break: 3,
                gap: 5,
            },
            {
                stage: 'semis',
                groupSize: 8,
                duration: 7.5,
                break: 3,
                gap: 5,
            },
            {
                stage: 'finals',
                groupSize: 8,
                duration: 15,
                break: 3,
                gap: 5,
            },
        ]
    }
    set teams(teams) {
        this.teamList = teams;
        this.groupSizes = teams.reduce((p, team) => {
            p[team.group] = (p[team.group] || 0) + 1
            return p
        }, {})
        console.table(this.teamList)
        this.generateMatches()
        this.simulateMatches()
    }

    generateMatches() {
        let matches = [];
    
        // Group teams by their group
        const teamsByGroup = this.teamList.reduce((groups, team) => {
            if (!groups[team.group]) {
                groups[team.group] = [];
            }
            groups[team.group].push(team.name);
            matches[team.group] = [];
            return groups;
        }, {});

        Object.keys(teamsByGroup)
            .forEach(group => {
                const groupTeams = teamsByGroup[group];
                let timeOffset = 0
                let nextStart = '09:00'
                for (let i = 0; i < groupTeams.length; i++) {
                    for (let j = i + 1; j < groupTeams.length; j++) {
                        const d = this.stageParameters.find(d => d.groupSize === this.groupSizes[group])
                        const { duration = 0, break: breakDuration = 0, gap = 0 } = d || {}
                        matches[group].push({
                            offset: timeOffset,
                            start: nextStart,
                            team1: groupTeams[i],
                            team2: groupTeams[j],
                            time: {
                                playing: duration * 2,
                                gap: gap + breakDuration,
                            }
                        })
                        const minWait = Math.round((duration * 2 + gap + breakDuration) / 5) * 5
                        timeOffset += minWait
                        nextStart = addMinutes(nextStart,  minWait)
                    }
                }
            });

            Object.keys(matches)
            .forEach(group => {
                //console.log(`Group ${group}`)
                // console.table(matches[group].map(x => ({ ...x, time: `${x.time.playing} + ${x.time.gap}` })))
                const totalPlayingTime = matches[group].reduce((p, c) => p + c.time.playing, 0)
                console.log(`Active team playing time: ${totalPlayingTime/this.groupSizes[group]} minutes.`)
            });
        this.matches = matches;
        return matches;
    }

    matchesTable(group) {
        if (this.matches[group] === undefined) return []
        return this.matches[group].map(x => ({ ...x, time: `${x.time.playing} + ${x.time.gap}` }))
    }

    simulateMatches() {
        console.log('Simulating matches...')
        Object.keys(this.matches)
            .forEach(group => {
                console.log(`Group ${group}`)
                const matches = this.matches[group].map(match => {
                    const { team1, team2, offset } = match;
                    const goals1 = Math.round(Math.random() * 5)
                    const points1 = Math.round(Math.random() * 15)
                    const total1 = goals1 * 3 + points1
                    const goals2 = Math.round(Math.random() * 5)
                    const points2 = Math.round(Math.random() * 15)
                    const total2 = goals2 * 3 + points2
                    
                    return {
                        team1, goals1, points1, total1,
                        team2, goals2, points2, total2,
                        winner: total1 > total2 ? team1 : team2,
                    }
                })
                console.table(matches)
            })
    }
}

function addMinutes(time, minsToAdd) {
    const [hours, minutes] = time.split(':').map(Number);
    let newMinutes = minutes + minsToAdd;
    let newHours = hours + Math.floor(newMinutes / 60);
    newMinutes %= 60;
    newHours %= 24; // Reset to 0 if it goes to 24

    // Zero padding
    const formattedHours = newHours.toString().padStart(2, '0');
    const formattedMinutes = newMinutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}


