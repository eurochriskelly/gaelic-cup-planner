const useMockEndpoints = (app) => {

  const routes = {
    "/api/tournaments/:tournamentId/pitches": "pitches",
    // fixme: supersede this  and keep next
    "/api/group/standings/:tournamentId": "standings",
    "/api/tournaments/:tournamentId/standings": "standings",
    "/api/tournaments": "tournaments",
    // fixtures/index.js
    "/api/fixtures": "fixtures",
    "/api/fixtures/:pitch": "fixturesByPitchA"
  };
  
  Object.keys(routes).forEach(route => {
    const value = routes[route];
    app.get(route, async (req, res) => 
      res.json(require(`./data/${value}.js`))
    )
  })
}


module.exports = {
  useMockEndpoints,
}
