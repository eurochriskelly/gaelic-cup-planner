
// Tournament configuration and sample data
export const TOURNAMENT_CONFIG = {
    categories: ['Ladies', 'Mens'],
    stages: ['group', 'shd_quarters', 'cup_semis', 'shd_semis', 'cup_finals', 'shd_finals', 'plt_finals'],
    pitches: ['Pitch_1', 'Pitch_2', 'Pitch_3'],
    defaultCategory: 'Ladies',
    sampleData: {
        upcoming: [
            {
                id: 102,
                category: 'Ladies',
                stage: 'group',
                group: '2',
                pitch: 'Pitch_3',
                time: '11:35',
                team1: 'Eindhoven',
                team2: 'Luxembourg A',
                umpire: 'Belgium A'
            }
        ],
        finished: [
            {
                id: 101,
                category: 'Ladies',
                stage: 'group',
                group: '1',
                team1: {
                    name: 'Leuven A/Belgium B',
                    score: '1-04',
                    points: '07'
                },
                team2: {
                    name: 'Belgium A',
                    score: '5-05',
                    points: '20',
                    winner: true
                }
            }
        ]
    }
};