export default class GroupManagerHelper {
    constructor() {
        this.groupLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.matches = {}
        this.teamList = []
        this.durations = [
            {
                groupSize: 3,
                duration: 15,
                break: 5,
                gap: 10,
            },
            {
                groupSize: 4,
                duration: 10,
                break: 3,
                gap: 5,
            },
            {
                groupSize: 5,
                duration: 8,
                break: 3,
                gap: 5,
            }
        ]
        this.groupSizes = {}
    }
    set teams(teams) {
        console.log('-------')
        this.teamList = teams;
        this.groupSizes = teams.reduce((p, team) => {
            p[team.group] = (p[team.group] || 0) + 1
            return p
        }, {})
        console.table(this.teamList)
        this.generateMatches()
    }
    generateMatches() {
        const matches = [];
    
        // Group teams by their group
        const teamsByGroup = this.teamList.reduce((groups, team) => {
            if (!groups[team.group]) {
                groups[team.group] = [];
            }
            groups[team.group].push(team.name);
            matches[team.group] = [];
            return groups;
        }, {});

        console.log(teamsByGroup)
        
        // Generate matches for each group
        Object.keys(teamsByGroup)
            .forEach(group => {
                const groupTeams = teamsByGroup[group];
                for (let i = 0; i < groupTeams.length; i++) {
                    for (let j = i + 1; j < groupTeams.length; j++) {
                        const d = this.durations.find(d => d.groupSize === this.groupSizes[group])
                        const { duration = 0, break: breakDuration = 0, gap = 0 } = d || {}
                        matches[group].push({
                            startTime: '00:00',
                            team1: groupTeams[i],
                            team2: groupTeams[j],
                            time: {
                                playing: duration * 2,
                                gap: gap + breakDuration,
                            }
                        });
                    }
                }
            });

        Object.keys(matches)
            .forEach(group => {
                console.log(`Group ${group}`)
                console.table(matches[group].map(x => ({ ...x, time: `${x.time.playing} + ${x.time.gap}` })))
                const totalPlayingTime = matches[group].reduce((p, c) => p + c.time.playing, 0)
                console.log(`Playing time is ${totalPlayingTime} minutes.`)
            });
        this.matches = matches;
        return matches;
    }
}