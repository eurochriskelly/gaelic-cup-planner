export default {
  fetchFixtures: (tournamentId, pitchId) =>
    new Promise((accept, reject) => {
      fetch(makeEndpoint(tournamentId, `${pitchId}`))
        .then((response) => response.json())
        .then((data) => {
          accept(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          reject(error);
        });
    }),
  startMatch: (tournamentId, fixtureId) =>
    new Promise((accept, reject) => {
      fetch(makeEndpoint(tournamentId, `${fixtureId}/start`))
        .then((response) => response.json())
        .then(async (data) => {
          accept(data);
        })
        .catch((error) => {
          console.log("Error starting match, ", error);
          reject(error);
        });
    }),
  updateScore: (tournamentId, fixtureId, scores) =>
    new Promise((accept, reject) => {
      fetch(
        makeEndpoint(tournamentId, `${fixtureId}/score`),
        makeRequest(scores)
      )
        .then((response) => response.json())
        .then(async (data) => {
          accept(data);
        })
        .catch((error) => {
          console.log("Error updating score, ", error);
          reject(error);
        });
    }),
  updateCardedPlayers: (tournamentId, fixtureId, players) =>
    new Promise((accept, reject) => {
      fetch(
        makeEndpoint(tournamentId, `${fixtureId}/carded`),
        makeRequest(players)
      )
        .then((response) => response.json())
        .then(async (data) => {
          accept(data);
        })
        .catch((error) => {
          console.log("Error updating carded players, ", error);
          reject(error);
        });
    }),
};

function makeRequest(obj) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  };
}

function makeEndpoint(tournamentId, rest) {
  if (!tournamentId) throw new Error("No :tournamenId!");
  const endpoint = `/api/tournaments/${tournamentId}/fixtures/${rest}`;
  console.log(`API request to endpoint ${endpoint}`);
  return endpoint;
}
