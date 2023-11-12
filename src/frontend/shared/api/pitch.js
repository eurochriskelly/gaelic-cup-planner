export default {
    fetchFixtures: (pitchId) => new Promise((accept, reject) => {
        fetch(`/api/fixtures/${pitchId}`)
            .then(response => response.json())
            .then(data => {
                accept(data)
            })
            .catch(error => {
                console.error('Error fetching data:', error)
                reject(error)
            })
    }),
    startMatch: (fixtureId) => new Promise((accept, reject) => {
        fetch(`/api/fixtures/${fixtureId}/start`)
            .then(response => response.json())
            .then(async data => {
                accept(data)
            })
            .catch(error => {
                console.log('Error starting match, ', error)
                reject(error)
            })
    }),
    updateScore: (fixtureId, scores) => new Promise((accept, reject) => {
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scores)
        }
        fetch(`/api/fixtures/${fixtureId}/score`, request)
            .then(response => response.json())
            .then(async data => {
                accept(data)
            })
            .catch(error => {
                console.log('Error updating score, ', error)
                reject(error)
            })
    })
}


