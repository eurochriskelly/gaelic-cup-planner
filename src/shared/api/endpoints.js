import { fetchApi, fetchRootApi } from './api-helper.js'; // Import new helper

export default {

  // Fetch active tournaments with specific statuses
  fetchActiveTournaments: async (statuses = ['new', 'in-design']) =>
    await fetchRootApi('/tournaments', 'GET', null, { status: statuses.join(',') }),

  // Fetch fixtures for a specific pitch
  fetchFilteredFixtures: async (tournamentId, filter) =>
    await fetchRootApi(`/tournaments/${tournamentId}/fixtures/filtered`, 'POST', filter),
  
  // Fetch fixtures for a specific pitch
  fetchFixtures: async (tournamentId, pitchId) =>
    await fetchApi(tournamentId, `pitches/${pitchId}/fixtures`),

  // Fetch a single fixture's details
  fetchFixture: (tournamentId, fixtureId) =>
    fetchApi(tournamentId, `/${fixtureId}`),

  // Start a specific match
  startMatch: async (tournamentId, fixtureId) =>
    await fetchApi(tournamentId, `${fixtureId}/start`, 'POST'),

  // Start a specific match
  endMatch: async (tournamentId, fixtureId) =>
    await fetchApi(tournamentId, `${fixtureId}/end`, 'POST'),

  // Update the score for a specific match
  updateScore: (tournamentId, fixtureId, result) =>
    fetchApi(tournamentId, `${fixtureId}/score`, 'POST', result),

  // Update the carded players for a specific match
  updateCardedPlayer: (tournamentId, fixtureId, player) =>
    fetchApi(tournamentId, `${fixtureId}/carded`, 'POST', player),

  // Update the carded players for a specific match
  deleteCardedPlayer: (tournamentId, fixtureId, player) =>
    fetchApi(tournamentId, `${fixtureId}/carded/${player.id}`, 'DELETE'),

  resetTournament: (tournamentId) =>
    fetch(`/api/tournaments/${tournamentId}/reset`, {
      method: 'POST',
    }),

  // Reschedule a match
  rescheduleMatch: (tournamentId, targetPitch, currentFixtureId, newFixtureId, placement) =>
    fetchApi(tournamentId, `${currentFixtureId}/reschedule`, 'POST', {
      fixtureId: newFixtureId,
      targetPitch,
      placement
    }),

  // Fetch all fixtures for the tournament (used in DrawerPostpone)
  fetchAllFixtures: (tournamentId) =>
    fetchApi(tournamentId, ''), // Empty path means base /fixtures endpoint

  // Fetch all pitches for the tournament (used in DrawerPostpone)
  // Note: This endpoint is slightly different (/pitches, not /fixtures)
  // We might need to adjust makeEndpoint or add a new helper if this pattern repeats
  fetchPitches: (tournamentId) =>
    new Promise((accept, reject) => {
      // Using fetch directly as it doesn't fit the /fixtures pattern perfectly
      fetch(`/api/tournaments/${tournamentId}/pitches`)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then(data => accept(data))
        .catch(error => {
          console.error(`Error fetching pitches for tournament ${tournamentId}:`, error);
          reject(error);
        });
    }),

  // Check if a tournament code is valid for a given role
  checkTournamentCode: (tournamentId, code, role) =>
    fetchRootApi(`/tournaments/${tournamentId}/code-check/${code}?role=${role}`),

  // Fetch available filters for a tournament
  fetchFilters: (tournamentId, role, categories = []) => {
    const categoryParam = categories.length ? `&category=${categories.join(',')}` : '';
    return fetchRootApi(`/tournaments/${tournamentId}/filters?role=${role}${categoryParam}`);
  },
};
