// src/ui/public/scripts/webcomponents/match-row.js
function createMatchRow({ id, team1, team2, score1, score2, date, location, isLoggedIn }) {
  return `
    <tr>
      <td style="padding: 8px">${id || 'N/A'}</td>
      <td style="padding: 8px">${team1 || 'TBD'}</td>
      <td style="padding: 8px">${team2 || 'TBD'}</td>
      <td style="padding: 8px">${score1 !== undefined ? score1 : '-'}</td>
      <td style="padding: 8px">${score2 !== undefined ? score2 : '-'}</td>
      <td style="padding: 8px" class="text-nowrap">${date ? date.substring(0, 10) : 'N/A'}</td>
      <td style="padding: 8px">${location || 'N/A'}</td>
      ${isLoggedIn ? `
        <td style="padding: 8px"><button style="padding: 8px 16px; border-radius: 4px; color: white; background-color: #f97316" hx-get="/planning/matches/${id}" hx-target="body" hx-swap="outerHTML">Edit</button></td>
        <td style="padding: 8px"><button style="padding: 8px 16px; border-radius: 4px; color: white; background-color: #16a34a" hx-post="/execution/matches/${id}/score" hx-target="body" hx-swap="outerHTML">Update Score</button></td>
      ` : ''}
    </tr>
  `;
}

module.exports = { createMatchRow };
