const state = {
    currentFixture: null,
    fixtures: [
        {
            id: 'fixture1',
            Scheduled: '08:25',
            Started: new Date().toISOString(),
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Berlin A',
            Goals1: 3,
            Points1: 1,
            Team2: 'Hamburg',
            Goals2: 1,
            Points2: 7,
        },
        {
            id: 'fixture2',
            Scheduled: '09:00',
            Started: new Date().toISOString(),
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Copenhagen Hagen Das Ice Cream Yum Yum',
            Goals1: 2,
            Points1: 0,
            Team2: 'Amsterdam',
            Goals2: 0,
            Points2: 2,
        },
        {
            id: 'fixture3',
            Scheduled: '09:25',
            Started: new Date().toISOString(),
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Brussels B',
            Goals1: '',
            Points1: '',
            Team2: 'Berlin',
            Goals2: '',
            Points2: '',
        },
        {
            id: 'fixture4',
            Scheduled: '10:30',
            Stage: 'Group',
            Category: 'MS1',
            Group: '1',
            Pitch: 'Z3',
            Team1: 'Maastricht',
            Goals1: '',
            Points1: '',
            Team2: 'Amsterdam',
            Goals2: '',
            Points2: '',
        },
        {
            id: 'fixture5',
            Scheduled: '11:00',
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Amsterdam',
            Goals1: '',
            Points1: '',
            Team2: 'Eindhoven',
            Goals2: '',
            Points2: '',
        },
        {
            id: 'fixture6',
            Scheduled: '11:30',
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Brussels B',
            Goals1: '',
            Points1: '',
            Team2: 'Berlin',
            Goals2: '',
            Points2: '',
        },
        {
            id: 'fixture7',
            Scheduled: '12:00',
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Amsterdam',
            Goals1: '',
            Points1: '',
            Team2: 'Eindhoven',
            Goals2: '',
            Points2: '',
        },
        {
            id: 'fixture8',
            Scheduled: '13:15',
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Amsterdam',
            Goals1: '',
            Points1: '',
            Team2: 'Eindhoven',
            Goals2: '',
            Points2: '',
        },
        {
            id: 'fixture9',
            Scheduled: '13:45',
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Amsterdam dd',
            Goals1: '',
            Points1: '',
            Team2: 'Eindhoven',
            Goals2: '',
            Points2: '',
        },
        {
            id: 'fixture10',
            Scheduled: '12:25',
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Amsterdam',
            Goals1: '',
            Points1: '',
            Team2: 'Eindhoven',
            Goals2: '',
            Points2: '',
        },
        {
            id: 'fixture11',
            Scheduled: '12:25',
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Amsterdam',
            Goals1: '',
            Points1: '',
            Team2: 'Eindhoven',
            Goals2: '',
            Points2: '',
        },
        {
            id: 'fixture12',
            Scheduled: '12:25',
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Amsterdam',
            Goals1: '',
            Points1: '',
            Team2: 'Eindhoven',
            Goals2: '',
            Points2: '',
        },
        {
            id: 'fixture13',
            Scheduled: '12:25',
            Stage: 'Group',
            Category: 'MJ1',
            Group: '1',
            Pitch: 'Z1',
            Team1: 'Amsterdam',
            Goals1: '',
            Points1: '',
            Team2: 'Eindhoven',
            Goals2: '',
            Points2: '',
        },

    ]
}

const google = {
    script: {
        run: {
            withSuccessHandler: callback => {
                return {
                    getListOfPitches: () => {
                        callback([
                            {
                                id: 'Z1',
                                location: 'Zagreb',
                                type: 'Grass',
                            },
                            {
                                id: 'Z2',
                                location: 'Zuiderpark',
                                type: 'Grass',
                            },
                            {
                                id: 'Z3',
                                location: 'Zuiderpark',
                                type: 'Astro',
                            },
                            {
                                id: 'S1',
                                location: 'De Ster',
                                type: 'Astro',
                            },
                            {
                                id: 'S2',
                                location: 'De Ster',
                                type: 'Grass',
                            },
                            {
                                id: 'X1',
                                location: 'In a galaxy far far away, lives an alien lifeform to be reckoned with',
                                type: 'Grass',
                            },
                            {
                                id: 'Z7',
                                location: 'Zagreb',
                                type: 'Grass',
                            },
                            {
                                id: 'Z8',
                                location: 'Zagreb',
                                type: 'Grass',
                            },

                        ])
                    },
                    getListOfTeams: () => {
                        callback([
                            {
                                name: 'Berlin Badgers',
                                gender: 'Men',
                                level: 'Junior',
                            },
                            {
                                name: 'Kiev Kangaroos',
                                gender: 'Men',
                                amagamation: [
                                    'Melbourne FC',
                                    'Kiev FC',
                                ],
                                level: 'Junior',
                            },
                            {
                                name: 'Moscow Meerkats',
                                gender: 'Ladies',
                                level: 'Senior',
                            },
                            {
                                name: 'Phantom Friends',
                                amagamation: [
                                    'Berlin',
                                    'Kiev',
                                    'Moscow',
                                ],
                                gender: 'Ladies',
                                level: 'Senior',
                            },
                        ])
                    },
                    getFixtures(pitch) {
                        console.log('getting fixtures', state.fixtures)
                        callback(state.fixtures.filter(f => f.Pitch === pitch))
                    },
                    updateMatchScore: (fixtureId, score) => {
                        state.fixtures.forEach(f => {
                            if (f.id === fixtureId) {
                                f.Goals1 = +score.Team1.goals
                                f.Points1 = +score.Team1.points
                                f.Goals2 = +score.Team2.goals
                                f.Points2 = +score.Team2.points
                            }
                        })
                        callback(state.fixtures)
                    },
                    startFixture: (fixtureId) => {
                        state.fixtures.forEach(f => {
                            if (f.id === fixtureId) {
                                f.Started = new Date().toISOString()
                            }
                        })
                    },
                    getTeamStatus: (team) => {
                        callback({
                            team: 'Team 1',
                            group: 'A',
                            MP: 3,
                            W: 2,
                            D: 0,
                            L: 1,
                            PF: 6,
                            PA: 4,
                            PD: 2,
                            Pts: 6,
                        })
                    }
                }
            }
        }
    }
}

export default google