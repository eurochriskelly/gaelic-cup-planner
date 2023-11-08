/* TESTS */
const test_getFixtures = () => {
    const result = getFixtures('S1');
    JJ('result', result, 40)
}

const test_updateScore = () => {
    const fixture = {
        "Goals1": 1,
        "Points1": 6,
        "Goals2": 2,
        "Points2": 1,
        "Group": 2,
        "Started": "",
        "Total1": 9,
        "Pts1": 3,
        "Pts2": 0,
        "Total2": 7,
        "MID": 56,
        "Winner": "MJ2-Den Haag B",
        "Scheduled": "09:35",
        "Reported": "x",
        "Pitch": "W2",
        "Stage": "Group",
        "id": "MJ2-Den Haag BMJ2-MondevilleSat Dec 30 1899 09:35:39 GMT+0000 (Central European Standard Time)W2",
        "Name1": "MJ2-Den Haag B",
        "Catgory": "MJ2",
        "Name2": "MJ2-Mondeville"
    }
    const score = { 
        "Goals1": 9,
        "Points1": 9,
        "Goals2": 9,
        "Points2": 9,
    }
    updateScore(fixture, score);
}

const test_getListOfPitches = () => {
    const result = getListOfPitches();
    JJ('result', result, 40)   
}