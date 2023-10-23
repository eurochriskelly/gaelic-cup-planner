const google = {
    script: {
        run: {
            withSuccessHandler: callback => {
                return {
                    getListOfTeams: () => {
                        callback([
                            {
                                name: 'Team 1',
                                gender: 'Men',
                                level: 'Junior',
                            },
                            {
                                name: 'Team 2',
                                gender: 'Men',
                                level: 'Junior',
                            },
                            {
                                name: 'Team 3',
                                gender: 'Ladies',
                                level: 'Senior',
                            },
                        ])
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