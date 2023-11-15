const GroupPlanner = require(".")

const teams = [
    'Team 1',
    'Team 2',
    'Team 3',
    'Team 4',
    'Team 5',
    'Team 6',
    'Team 7',
    'Team 8',
    'Team 9',
    'Team 10',
]
const GP = new GroupPlanner(teams, 5, 5)

GP.generateFixtures()

console.log(GP)